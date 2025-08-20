const ENV = {
  BACK_END_URL: import.meta.env.VITE_BACK_END_URL as string,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  BACK_END_STATIC:
    (import.meta.env.VITE_BACK_END_STATIC as string) || 'http://localhost:5111',
}

export { ENV }
