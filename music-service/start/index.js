'use strict'

const { ApolloServer } = require('apollo-server')

const logger = require('./lib/logger')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen(4001).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
