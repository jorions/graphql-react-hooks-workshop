'use strict'

const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = process.env

const generateToken = ({ email, id }) => jwt.sign({ data: { email, id } }, TOKEN_SECRET, { expiresIn: '24h' })

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id })
      // The defaultResolverTest key is used to demonstrate the use of default vs defined resolvers
      return user.error
        ? { success: false, message: user.error }
        : { success: true, user: { ...user, defaultResolverTest: { innerKey: 'DEFAULT RESOLVER' } } }
    },
  },
  Mutation: {
    signUp: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.signUp({ email, password })
      if (user.error) return { success: false, message: user.error }

      const token = await generateToken(user)

      return { success: true, token }
    },
    logIn: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.logIn({ email, password })
      if (user.error) return { success: false, message: user.error }

      const token = await generateToken(user)

      return { success: true, token }
    },
  },
  DefaultResolverTest: {
    // This is a defined resolver. Uncomment to see it overwrite the default resolver.
    // Note that if the defaultResolverTest key is null, then this resolver will
    // never actually get hit.
    // Note that the 'parent' argument in this case is the full defaultResolverTest
    // object which enabled this resolver to get hit.
    // innerKey: parent => {
    //   console.log(parent)
    //   return 'DEFINED RESOLVER'
    // },
  },
  User: {
    // This receives the object returned by any other services Music Service's Song.user resolver.
    // __resolveReference is a special function provided when creating a federated
    // schema, and so it won't be called when using this service on its own. It will
    // only get called when referring to the User from other services.
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(serviceObject, { dataSources }) {
      const { id } = serviceObject
      const user = await dataSources.userAPI.findById({ id })
      if (user.error) return null // When there is no match, just return null
      return { ...serviceObject, ...user }
    },
  },
}
