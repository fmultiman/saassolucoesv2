import { getRedisClient } from "./redis"
import { cookies } from "next/headers"
import { createHash } from "crypto"

const SESSION_TTL = 60 * 60 * 24 * 7 // 7 dias em segundos

interface SessionData {
  userId: string
  userType: string
  email: string
  name?: string
  metadata?: Record<string, any>
  createdAt: number
  lastActive: number
}

// Gerar ID de sessão único
function generateSessionId(userId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString()
  return createHash("sha256").update(`${userId}-${timestamp}-${random}`).digest("hex")
}

// Criar nova sessão
async function createSession(data: Omit<SessionData, "createdAt" | "lastActive">): Promise<string> {
  const redis = getRedisClient()
  const sessionId = generateSessionId(data.userId)

  const sessionData: SessionData = {
    ...data,
    createdAt: Date.now(),
    lastActive: Date.now(),
  }

  // Armazenar dados da sessão
  await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), { ex: SESSION_TTL })

  // Mapear usuário para sessões ativas
  await redis.sadd(`user_sessions:${data.userId}`, sessionId)

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL,
    path: "/",
    sameSite: "lax",
  })

  return sessionId
}

// Obter sessão atual
async function getCurrentUser(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    return null
  }

  return getSessionById(sessionId)
}

// Obter sessão por ID
async function getSessionById(sessionId: string): Promise<SessionData | null> {
  const redis = getRedisClient()
  const sessionData = await redis.get<string>(`session:${sessionId}`)

  if (!sessionData) {
    return null
  }

  try {
    const session = JSON.parse(sessionData) as SessionData

    // Atualizar timestamp de última atividade
    await updateSessionActivity(sessionId)

    return session
  } catch (error) {
    console.error("Erro ao fazer parse dos dados da sessão:", error)
    return null
  }
}

// Atualizar atividade da sessão
async function updateSessionActivity(sessionId: string): Promise<void> {
  const redis = getRedisClient()
  const sessionData = await redis.get<string>(`session:${sessionId}`)

  if (sessionData) {
    try {
      const session = JSON.parse(sessionData) as SessionData
      session.lastActive = Date.now()

      await redis.set(`session:${sessionId}`, JSON.stringify(session), { ex: SESSION_TTL })
    } catch (error) {
      console.error("Erro ao atualizar atividade da sessão:", error)
    }
  }
}

// Encerrar sessão
async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value

  if (sessionId) {
    await destroySessionById(sessionId)
  }

  cookieStore.delete("session_id")
}

// Encerrar sessão por ID
async function destroySessionById(sessionId: string): Promise<void> {
  const redis = getRedisClient()

  // Obter dados da sessão para remover do mapeamento de usuário
  const sessionData = await redis.get<string>(`session:${sessionId}`)

  if (sessionData) {
    try {
      const session = JSON.parse(sessionData) as SessionData
      await redis.srem(`user_sessions:${session.userId}`, sessionId)
    } catch (error) {
      console.error("Erro ao remover sessão do mapeamento de usuário:", error)
    }
  }

  // Remover dados da sessão
  await redis.del(`session:${sessionId}`)
}

// Listar todas as sessões ativas de um usuário
async function getUserActiveSessions(userId: string): Promise<SessionData[]> {
  const redis = getRedisClient()
  const sessionIds = await redis.smembers(`user_sessions:${userId}`)

  if (!sessionIds.length) {
    return []
  }

  const sessions: SessionData[] = []

  for (const sessionId of sessionIds) {
    const sessionData = await redis.get<string>(`session:${sessionId}`)

    if (sessionData) {
      try {
        sessions.push(JSON.parse(sessionData) as SessionData)
      } catch (error) {
        console.error("Erro ao fazer parse dos dados da sessão:", error)
      }
    } else {
      // Remover referência a sessão que não existe mais
      await redis.srem(`user_sessions:${userId}`, sessionId)
    }
  }

  return sessions
}

// Encerrar todas as sessões de um usuário (exceto a atual)
async function destroyAllUserSessions(userId: string, exceptCurrentSession = true): Promise<number> {
  const redis = getRedisClient()
  const sessionIds = await redis.smembers(`user_sessions:${userId}`)

  if (!sessionIds.length) {
    return 0
  }

  let currentSessionId: string | null = null;
  if (exceptCurrentSession) {
    const cookieStore = await cookies();
    currentSessionId = cookieStore.get("session_id")?.value || null;
  }

  let destroyedCount = 0

  for (const sessionId of sessionIds) {
    if (exceptCurrentSession && sessionId === currentSessionId) {
      continue
    }

    await redis.del(`session:${sessionId}`)
    destroyedCount++
  }

  // Atualizar conjunto de sessões do usuário
  if (exceptCurrentSession && currentSessionId) {
    await redis.del(`user_sessions:${userId}`)
    await redis.sadd(`user_sessions:${userId}`, currentSessionId)
  } else {
    await redis.del(`user_sessions:${userId}`)
  }

  return destroyedCount
}

export {
  createSession,
  getCurrentUser,
  getSessionById,
  updateSessionActivity,
  destroySession,
  destroySessionById,
  getUserActiveSessions,
  destroyAllUserSessions,
}
