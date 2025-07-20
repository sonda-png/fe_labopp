export const parseStatusFilter = (
  value: string | undefined
): string | undefined => {
  if (value === 'true') return 'true'
  if (value === 'false') return 'false'
  return undefined
}
