export function formatCell(value) {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function convertArg(value, type) {
  if (type === 'int' || type === 'java.lang.Integer') return Number.parseInt(value, 10)
  if (type === 'long' || type === 'java.lang.Long') return Number.parseInt(value, 10)
  if (type === 'double' || type === 'java.lang.Double') return Number.parseFloat(value)
  if (type === 'float' || type === 'java.lang.Float') return Number.parseFloat(value)
  if (type === 'boolean' || type === 'java.lang.Boolean') return value === 'true'
  if (type === 'short' || type === 'java.lang.Short') return Number.parseInt(value, 10)
  if (type === 'byte' || type === 'java.lang.Byte') return Number.parseInt(value, 10)
  if (type === 'char' || type === 'java.lang.Character') return value?.[0] || ''
  if (type !== 'java.lang.String' && type !== 'String' && value?.trim()?.startsWith('{')) {
    try { return JSON.parse(value) } catch { return value }
  }
  return value
}
