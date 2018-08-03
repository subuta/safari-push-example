import Router from 'koa-router'
import send from 'koa-send'

import {
  PUBLIC_DIR
} from '../config'

const router = new Router()

router.post('/v1/log', async (ctx) => {
  console.log(ctx.headers)
  const { logs } = ctx.request.body
  logs.forEach((log) => console.log('[log]', log))
  ctx.body = ''
})

router.post('/v1/pushPackages/com.sub-labo.safari-push-example', async (ctx) => {
  await send(ctx, 'safari-push-example.pushpackage.zip', {root: PUBLIC_DIR})
})

export default router
