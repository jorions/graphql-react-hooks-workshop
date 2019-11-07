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
    return userId ? { userId: Number(userId) } : null
  },
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  dataSources: () => ({
    lyricsAPI,
    songAPI: new SongAPI({ store }),
  }),
})

server.listen(4001).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
