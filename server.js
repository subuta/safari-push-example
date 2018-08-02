// Based on https://github.com/wingleung/safari-push-serverside/blob/master/node_http_server.js

import dotenv from 'dotenv'
import Koa from 'koa'
import logger from 'koa-logger'
import koaBody from 'koa-body'
import serve from 'koa-static'
import clearModule from 'clear-module'

// Load `.env`
dotenv.config()

const {
  PORT
} = process.env

// Watch(file changes) and clear pages module cache on dev.
const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  const watcher = require('sane')('./server')
  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing /server module cache from server')
      clearModule.match(/server/)
    })
  })
}

const PUBLIC_DIR = 'public'
const port = parseInt(PORT, 10) || 5000

const app = new Koa()

// log requests
app.use(logger())

// parse body
app.use(koaBody());

// Register pages routes/allowedMethods
if (dev) {
  // Dynamic import modules for development(With no-module-cache).
  // SEE: https://github.com/glenjamin/ultimate-hot-reloading-example/blob/master/server.js
  app.use((...args) => require('./server/routes').default.routes().apply(null, args))
  app.use((...args) => require('./server/routes').default.allowedMethods().apply(null, args))
} else {
  // Use modules statically otherwise (prod/test).
  const routes = require('./server/routes').default
  app.use(routes.routes())
  app.use(routes.allowedMethods())
}

// otherwise PUBLIC_DIR
app.use(serve(PUBLIC_DIR))

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
