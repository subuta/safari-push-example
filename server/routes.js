import Router from 'koa-router'
import send from 'koa-send'

import {
  PUBLIC_DIR
} from '../config'

const router = new Router()

router.post('/v1/log', async (ctx) => {
  console.log(ctx.headers)
  const {logs} = ctx.request.body
  logs.forEach((log) => console.log('[log]', log))
  ctx.body = ''
})

router.post('/v1/pushPackages/web.com.sub-labo.safari-push-example', async (ctx) => {
  await send(ctx, 'safari-push-example.pushpackage.zip', {root: PUBLIC_DIR})
})

router.post('/v1/devices/:deviceToken/registrations/:websitePushID', async (ctx) => {
  const {deviceToken, websitePushID} = ctx.params

  const subscribeData = {
    deviceToken: deviceToken,
    websitePushID: websitePushID,
    platform: 'safari'
  }

  console.log('[subscribed]', JSON.stringify(subscribeData))

  ctx.body = ''
})

router.delete('/v1/devices/:deviceToken/registrations/:websitePushID', async (ctx) => {
  const {deviceToken, websitePushID} = ctx.params

  const subscribeData = {
    deviceToken: deviceToken,
    websitePushID: websitePushID,
    platform: 'safari'
  }

  console.log('[unSubscribed]', JSON.stringify(subscribeData))

  ctx.body = ''
})

export default router
