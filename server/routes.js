import Router from 'koa-router'
import send from 'koa-send'
import _ from 'lodash'

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

  const Subscriptions = ctx.db.get('subscriptions')

  await Subscriptions
    .push(subscribeData)
    .write()

  const currentRows = Subscriptions.size().value()

  console.log('[subscribed]', JSON.stringify(subscribeData))
  console.log(`[subscribed] ${currentRows} subscription exists.`)

  ctx.body = ''
})

router.delete('/v1/devices/:deviceToken/registrations/:websitePushID', async (ctx) => {
  const {deviceToken, websitePushID} = ctx.params

  const subscribeData = {
    deviceToken: deviceToken,
    websitePushID: websitePushID,
    platform: 'safari'
  }

  const Subscriptions = ctx.db.get('subscriptions')

  await Subscriptions
    .remove(subscribeData)
    .write()

  const currentRows = Subscriptions.size().value()

  console.log('[unSubscribed]', JSON.stringify(subscribeData))
  console.log(`[unSubscribed] ${currentRows} subscription exists.`)

  ctx.body = ''
})

export default router
