import jwt from 'jsonwebtoken'

// eslint-disable-next-line import/prefer-default-export
export const parseToken = token => {
  const {
    exp,
    data: { id, firstName, username, email },
  } = jwt.decode(token)
  const now = Math.floor(Date.now() / 1000)

  if (exp < now) throw new Error('Token is expired')

  return { id, firstName, username, email }
}
