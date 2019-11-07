'use strict'

require('dotenv').config()

const { ApolloServer, AuthenticationError } = require('apollo-server')
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')
const jwt = require('jsonwebtoken')

const logger = require('./lib/logger')

// There is a whole lifecycle for the RemoteGraphQLDataSource class
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  // Gets called right before the request is sent to each service
  // eslint-disable-next-line class-methods-use-this
  willSendRequest({ request, context }) {
    const { userId } = context
    if (!userId) return
    request.http.headers.set('user-id', userId)
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'music-service', url: 'http://localhost:4001/graphql' },
    { name: 'user-service', url: 'http://localhost:4002/graphql' },
  ],
  buildService: ({ url }) => new AuthenticatedDataSource({ url }),
})

const start = async () => {
  // This will wait to load the federated schema before starting the service.
  const { schema, executor } = await gateway.load()

  const server = new ApolloServer({
    schema,
    executor,
    subscriptions: false, // Subscriptions are not allowed for gateways
    // This will set the context for the gateway, not the services it connects to.
    // The context we output here will get consumed by the AuthenticatedDataSource
    // class we have created.
    context: ({ req }) => {
      const auth = req.headers && req.headers.authorization
      if (!auth || auth === 'null') return null
      try {
        const { TOKEN_SECRET } = process.env
        const {
          data: { id },
        } = jwt.verify(auth, TOKEN_SECRET)
        return { userId: id }
      } catch (err) {
        throw new AuthenticationError('Invalid token. Log in again.')
      }
    },
  })

  server.listen(4000).then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`)
  })
}

start()
