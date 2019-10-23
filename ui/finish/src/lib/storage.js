import { parseToken } from './jwt'

const TOKEN_KEY = 'user'

export const setUser = token => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export const removeUser = () => {
  localStorage.removeItem(TOKEN_KEY)
  // A hacky way to force moving back to the home page
  location = '/' // eslint-disable-line no-restricted-globals
}

export const getUserToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? JSON.parse(token) : null
}

export const getUser = () => {
  const token = getUserToken()

  if (!token) return null

  try {
    const { id, email } = parseToken(token)
    return { id, email, token }
  } catch (err) {
    removeUser()
    return null
  }
}
