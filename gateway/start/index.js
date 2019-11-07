'use strict'

require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const { ApolloGateway } = require('@apollo/gateway')

const logger = require('./lib/logger')

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'music-service', url: 'http://localhost:4001/graphql' },
    { name: 'user-service', url: 'http://localhost:4002/graphql' },
  ],
})

const start = async () => {
  // This will wait to load the federated schema before starting the service.
  const { schema, executor } = await gateway.load()

  const server = new ApolloServer({
    schema,
    executor,
    subscriptions: false, // Subscriptions are not allowed for gateways
  })

  server.listen(4000).then(({ url }) => {
    logger.info(`🚀 Server ready at ${url}`)
  })
}

start()
