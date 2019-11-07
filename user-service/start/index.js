'use strict'

require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const logger = require('./lib/logger')
const createModels = require('./db/models')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const UserAPI = require('./dataSources/user')

const store = createModels()
const userAPI = new UserAPI({ store })

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  dataSources: () => ({
    userAPI,
  }),
})

server.listen(4002).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
