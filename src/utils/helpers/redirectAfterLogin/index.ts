/**
 * Utility function to get the login URL with redirect parameter
 * @param currentPath - The current path to redirect back to after login
 * @returns The login URL with redirect parameter
 */
export const getLoginUrlWithRedirect = (currentPath?: string): string => {
  const path = currentPath || window.location.pathname + window.location.search
  // Don't add redirect parameter if already on login page
  if (path === '/login' || path.startsWith('/login?')) {
    return '/login'
  }
  return `/login?redirectTo=${encodeURIComponent(path)}`
}

/**
 * Utility function to get the redirect path from URL search parameters
 * @param searchParams - The search parameters from the URL
 * @param defaultPath - The default path to redirect to if no redirect parameter is found
 * @returns The redirect path
 */
export const getRedirectPath = (
  searchParams: Record<string, string | undefined>,
  defaultPath: string = '/class-manage'
): string => {
  return searchParams.redirect || defaultPath
}
