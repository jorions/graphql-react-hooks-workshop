'use strict'

const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const logger = require('./lib/logger')
const createModels = require('./db/models')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const LyricsAPI = require('./dataSources/lyrics')
const SongAPI = require('./dataSources/song')

const store = createModels()
const lyricsAPI = new LyricsAPI()

const server = new ApolloServer({
  context: async ({ req }) => {
    const userId = req.headers['user-id']
    // Set the context for each request to include { userId, userEmail } from
    // the request headers. This is generated by the gateway server.
    return userId ? { userId: Number(userId) } : null
  },
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  // If you use this.context in your datasource, it's critical to create a new
  // instance in the dataSources function and to not share a single instance. Otherwise,
  // initialize may be called during the execution of async code for a specific user,
  // and replace this.context by the context of another user.
  dataSources: () => ({
    lyricsAPI,
    songAPI: new SongAPI({ store }),
  }),
})

server.listen(4001).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
