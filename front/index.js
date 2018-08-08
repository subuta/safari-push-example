const WEBSITE_PUSH_ID = process.env.WEBSITE_PUSH_ID
const WEB_SERVICE_URL = process.env.WEB_SERVICE_URL

const checkRemotePermission = (permissionData) => {
  console.log('Checking permission for push notification')

  if (permissionData.permission === 'default') {
    console.log('Permission is default (first time)')
    console.log('Validating push package before showing request popup...')

    window.safari.pushNotification.requestPermission(
      WEB_SERVICE_URL, // The web service URL.
      WEBSITE_PUSH_ID, // The Website Push ID.
      {}, // Data that you choose to send to your server to help you identify the user.
      checkRemotePermission // The callback function.
    )
  } else if (permissionData.permission === 'denied') {
    console.error('Permission is denied')
  } else if (permissionData.permission === 'granted') {
    console.log('Permission is granted')
    console.log(`User device token is: ${permissionData.deviceToken}`)
  }
}

const bindEventListeners = () => {
  const $notify = document.querySelector('#notify')
  $notify.addEventListener('click', (e) => {
    window.fetch(`${WEB_SERVICE_URL}/notify`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({})
    })
  })
}

const onReady = () => {
  if ('safari' in window && 'pushNotification' in window.safari) {
    console.log('Browser is safari and has support for push notifications')

    const permissionData = window.safari.pushNotification.permission(WEBSITE_PUSH_ID)

    checkRemotePermission(permissionData)
    bindEventListeners()
  } else {
    console.error('Browser is not safari, use safari to proceed. If you are using safari you might not have support for push notifications enabled')
  }
}

// Native
// Check if the DOMContentLoaded has already been completed
if (document.readyState !== 'loading') {
  onReady()
} else {
  document.addEventListener('DOMContentLoaded', onReady)
}
