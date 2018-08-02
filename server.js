// Based on https://github.com/wingleung/safari-push-serverside/blob/master/node_http_server.js

import dotenv from 'dotenv'
import Koa from 'koa'
import logger from 'koa-logger'
import serve from 'koa-static'
import routes from './server/routes'

// Load `.env`
dotenv.config()

const {
  PORT
} = process.env

const PUBLIC_DIR = 'public'
const port = parseInt(PORT, 10) || 5000

const app = new Koa()

// log requests
app.use(logger())

app.use(routes.routes())
app.use(routes.allowedMethods())

// otherwise PUBLIC_DIR
app.use(serve(PUBLIC_DIR))

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
