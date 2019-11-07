'use strict'

const { ApolloServer } = require('apollo-server')

const logger = require('./lib/logger')
const createModels = require('./db/models')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const LyricsAPI = require('./dataSources/lyrics')
const SongAPI = require('./dataSources/song')

const store = createModels()
const lyricsAPI = new LyricsAPI()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    lyricsAPI,
    songAPI: new SongAPI({ store }),
  }),
})

server.listen(4001).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`)
})
