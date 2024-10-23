const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'redis', // this must match the container name of redis image
  port: process.env.REDIS_PORT || 6379
})

module.exports = session({
  store: new RedisStore({
    client
  }),
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true
})
