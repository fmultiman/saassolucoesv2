type LogPayload = {
  context: string
  data?: unknown
}

function toErrorPayload(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return error
}

export function logInfo(context: string, data?: unknown) {
  console.info({
    level: "info",
    context,
    data,
  } satisfies LogPayload & { level: "info" })
}

export function logError(context: string, error: unknown) {
  console.error({
    level: "error",
    context,
    error: toErrorPayload(error),
  })
}
