export const getString = (value?: string | number | boolean): string | undefined => {
  switch (typeof value) {
    case 'number':
    case 'boolean': return value.toString()
    case 'string': return value
    default: return undefined
  }
}
