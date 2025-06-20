import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthValuesType {
  isAuthenticated: boolean
  userId: string
  email: string
  role: string
  token: string
}

interface AuthState {
  authValues: AuthValuesType
  setAuthData: (authValues: AuthValuesType) => void
  clearTokens: () => void
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
        userId: '',
        email: '',
        role: '',
        token: '',
      },
      setAuthData: authValues => set({ authValues }),
      clearTokens: () =>
        set({
          authValues: {
            isAuthenticated: false,
            userId: '',
            email: '',
            role: '',
            token: '',
          },
        }),

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
      name: 'auth-storage',
    }
  )
)
