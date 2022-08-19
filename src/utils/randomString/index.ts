import { randomBytes } from 'crypto'
export const getRandomString = async (
  length: number,
  encoding: BufferEncoding = 'base64url'
): Promise<string> => {
  const token = await randomBytes(length).toString(encoding)
  return token.substring(0, length)
}
