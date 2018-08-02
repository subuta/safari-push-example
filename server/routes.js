import Router from 'koa-router'

const router = new Router()

router.post('/v1/log', async (ctx) => {
  console.log(ctx.headers)
  console.log(ctx.request.body)

  const { logs } = ctx.request.body;

  logs.forEach((log) => console.log('[log]', log))

  // var body = ''
  // req.on('data', function (data) {
  //   body += data
  // })
  // req.on('end', function () {
  //   var POST = qs.parse(body)
  //   console.log(POST)
  //
  //   res.writeHead(200)
  //   res.end()
  // })
  ctx.body = ''
})

export default router
