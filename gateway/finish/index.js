'use strict'

require('dotenv').config()

const { ApolloServer, AuthenticationError } = require('apollo-server')
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')
const jwt = require('jsonwebtoken')

const logger = require('./lib/logger')

// There is a whole lifecycle for the RemoteGraphQLDataSource class
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  // One of those lifecycle methods is willSendRequest, which gets called right
  // before the request is sent to each service that the gateway connects to.
  // This is how we will set the authorization headers that other services will
  // then use.
  // eslint-disable-next-line class-methods-use-this
  willSendRequest({ request, context }) {
    const { userId } = context
    if (!userId) return
    request.http.headers.set('user-id', userId)
  }
}

const runUnmanaged = process.env.RUN_UNMANAGED === 'true'

const gatewayConfig = {
  buildService: ({ url }) => new AuthenticatedDataSource({ url }),
}

// When in development, provide the option to use an unmanaged configuration for
// maximum control over which services we are using.
if (runUnmanaged)
  gatewayConfig.serviceList = [
    { name: 'music-service', url: 'http://localhost:4001/graphql' },
    { name: 'user-service', url: 'http://localhost:4002/graphql' },
  ]

const gateway = new ApolloGateway(gatewayConfig)

const start = async () => {
  const serverConfigs = {
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
        // Instead of refreshing the JWT we just respond with an AuthenticationError.
        // If we wanted, we could implement an error handling flow. Read about it here:
        // https://blog.apollographql.com/full-stack-error-handling-with-graphql-apollo-5c12da407210
        throw new AuthenticationError('Invalid token. Log in again.')
      }
    },
  }

  // This will wait to load the federated schema before starting the service.
  // Alternatively we can say: new ApolloServer({ gateway, subscriptions, context })
  // With that syntax, Apollo will handle calling gateway.load under the hood
  // without waiting for the full schema to be connected before starting the server.
  // However that syntax breaks when using a managed configuration, so we can't use
  // it unless we are running with an unmanaged configuration.
  if (runUnmanaged) {
    const { schema, executor } = await gateway.load()
    serverConfigs.schema = schema
    serverConfigs.executor = executor
  } else {
    serverConfigs.gateway = gateway
  }

  const server = new ApolloServer(serverConfigs)

  server.listen(4000).then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`)
  })
}

start()
