import Router from 'koa-router'
import send from 'koa-send'
import apn from 'apn'
import _ from 'lodash'
import path from 'path'

import {
  PUBLIC_DIR
} from '../config'

const router = new Router()

// Extract keyId from Authentication token signing key file.
const KEY_ID = _.trimStart(path.basename(process.env.PROVIDER_AUTH_TOKEN_KEY_FILENAME, '.p8'), 'AuthKey_')

const provider = new apn.Provider({
  token: {
    key: process.env.PROVIDER_AUTH_TOKEN_KEY_FILENAME,
    keyId: KEY_ID,
    teamId: process.env.PROVIDER_AUTH_TOKEN_TEAM_ID
  },
  production: true
})

router.post('/v1/log', async (ctx) => {
  console.log(ctx.headers)
  const {logs} = ctx.request.body
  logs.forEach((log) => console.log('[log]', log))
  ctx.body = ''
})

router.post(`/v1/pushPackages/${process.env.WEBSITE_PUSH_ID}`, async (ctx) => {
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

router.post('/notify', async (ctx) => {
  const Subscriptions = ctx.db.get('subscriptions')
  const subscriptions = await Subscriptions.value()

  const deviceTokens = _.map(subscriptions, (s) => s.deviceToken);

  let notification = new apn.Notification()

  // Convenience setter
  notification.topic = process.env.WEBSITE_PUSH_ID
  notification.body = 'Updates from Safari Push Example!'
  notification.title = 'Safari Push Example'
  notification.urlArgs = ['example']
  notification.badge = 10

  const result = await provider.send(notification, deviceTokens)

  console.log('result.sent = ', result.sent)
  console.log('result.failed = ', result.failed)

  ctx.body = ''
})

export default router
