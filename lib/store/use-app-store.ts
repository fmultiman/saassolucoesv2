import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

interface AppState {
  user: User | null
  isAuthenticated: boolean
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  notifications: number

  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setNotifications: (count: number) => void
  clearNotifications: () => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      theme: "system",
      sidebarOpen: false,
      notifications: 0,

      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setNotifications: (count) => set({ notifications: count }),
      clearNotifications: () => set({ notifications: 0 }),
      logout: () => set({ user: null, isAuthenticated: false, notifications: 0 }),
    }),
    {
      name: "saas-app-storage",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
