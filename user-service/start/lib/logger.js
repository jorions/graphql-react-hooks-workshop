'use strict'

const bunyan = require('bunyan')

module.exports = bunyan.createLogger({
  name: 'user-service',
  serializers: bunyan.stdSerializers,
})
