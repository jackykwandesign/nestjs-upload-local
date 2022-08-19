export const parseBoolean = (str: string | number | boolean): boolean => {
  if (str === null || !str) {
    return false
  }
  if (typeof str === 'string') {
    const temp = str.toLowerCase()
    if (temp === 'true' || temp === '1') {
      return true
    }
  } else if (typeof str === 'boolean') {
    return str
  } else if (typeof str === 'number') {
    if (str === 1) {
      return true
    }
    return false
  }

  return false
}
