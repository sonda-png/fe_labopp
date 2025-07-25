export const objectToQueryString = (
  params: Record<string, string | undefined>
): string => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join('&')

  return query ? `?${query}` : ''
}
