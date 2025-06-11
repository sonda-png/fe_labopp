import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthValuesType {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  role: string | null
  userName: string | null
  email: string | null
  image: string
}

interface AuthState {
  authValues: AuthValuesType
  setAuthData: (authValues: AuthValuesType) => void
  clearTokens: () => void
  updateToken: (accessToken: string, refreshToken: string) => void
  updateAuthField: <K extends keyof AuthValuesType>(
    key: K,
    value: AuthValuesType[K]
  ) => void
  getRole: () => string | null
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authValues: {
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        role: null,
        userName: null,
        email: null,
        image: '',
      },
      setAuthData: authValues => set({ authValues }),
      clearTokens: () =>
        set({
          authValues: {
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            role: null,
            userName: null,
            email: null,
            image: '',
          },
        }),
      updateToken: (accessToken, refreshToken) =>
        set(state => ({
          authValues: {
            ...state.authValues,
            accessToken,
            refreshToken,
          },
        })),
      updateAuthField: (key, value) =>
        set(state => ({
          authValues: {
            ...state.authValues,
            [key]: value,
          },
        })),
      getRole: (): string | null => get().authValues.role,
    }),
    {
      name: 'app-storage',
    }
  )
)
