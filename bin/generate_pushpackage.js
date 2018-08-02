// Borrowed from https://github.com/wingleung/safari-push-serverside

import dotenv from 'dotenv'
import fs from 'fs'
import crypto from 'crypto'
import childProcess from 'child_process'
import rimraf from 'rimraf'
import archiver from 'archiver'
import mkdirp from 'mkdirp'

import {
  ROOT_DIR,
  PUBLIC_DIR
} from '../config'

// Load `.env`
dotenv.config()

const {
  WEBSITE_NAME,
  WEBSITE_PUSH_ID,
  ALLOWED_DOMAIN,
  URL_FORMAT_STRING,
  AUTHENTICATION_TOKEN,
  WEB_SERVICE_URL,
  CERT_P12_FILENAME,
  CERT_P12_PASSWORD
} = process.env

let rawFiles = [
  'icon.iconset/icon_16x16.png',
  'icon.iconset/icon_16x16@2x.png',
  'icon.iconset/icon_32x32.png',
  'icon.iconset/icon_32x32@2x.png',
  'icon.iconset/icon_128x128.png',
  'icon.iconset/icon_128x128@2x.png'
]

const website = {
  'websiteName': WEBSITE_NAME,
  'websitePushID': WEBSITE_PUSH_ID,
  'allowedDomains': ALLOWED_DOMAIN,
  'urlFormatString': URL_FORMAT_STRING,
  // any token to auth user
  'authenticationToken': AUTHENTICATION_TOKEN,
  'webServiceURL': WEB_SERVICE_URL
}

const manifest = {}
const pushPackagePath = `${PUBLIC_DIR}/safari-push-example.pushpackage`

const startedAt = new Date();
console.log('[start] generate_pushpackage.');

if (fs.existsSync(PUBLIC_DIR)) {
  rimraf.sync(PUBLIC_DIR)
}

mkdirp.sync(`${pushPackagePath}/icon.iconset`)

rawFiles.forEach((file) => {
  console.log('file = ', file)
  childProcess.execSync(`cp '${ROOT_DIR}/${file}' '${pushPackagePath}/${file}'`)
})

console.log('website.json')
fs.writeFileSync(pushPackagePath + '/website.json', JSON.stringify(website))

console.log('manifest.json')
rawFiles.push('website.json')

rawFiles.forEach((file) => {
  const sha1 = crypto.createHash('sha1')
  sha1.update(fs.readFileSync(pushPackagePath + '/' + file), 'binary')
  manifest[file] = sha1.digest('hex')
})

fs.writeFileSync(pushPackagePath + '/manifest.json', JSON.stringify(manifest))

// Generate pem from cer
childProcess.execSync(`openssl x509 -inform der -in AppleWWDRCA.cer -out AppleWWDRCA.pem`)

childProcess.execSync(`openssl pkcs12 -in '${CERT_P12_FILENAME}' -nocerts -out 'private.pem' -passin pass:'${CERT_P12_PASSWORD}' -passout pass:'${CERT_P12_PASSWORD}'`)
childProcess.execSync(`openssl pkcs12 -in '${CERT_P12_FILENAME}' -clcerts -nokeys -out 'cert.pem' -passin pass:'${CERT_P12_PASSWORD}'`)
childProcess.execSync(`openssl smime -binary -sign -certfile AppleWWDRCA.pem -signer cert.pem -inkey private.pem -in '${pushPackagePath}/manifest.json' -out '${pushPackagePath}/signature' -outform DER -passin pass:'${CERT_P12_PASSWORD}'`)

rawFiles.push('manifest.json')
rawFiles.push('signature')

if (fs.existsSync(pushPackagePath + '.zip')) {
  fs.unlinkSync(pushPackagePath + '.zip')
}

const output = fs.createWriteStream(`${pushPackagePath}.zip`)
const archive = archiver('zip')

output.on('close', function () {
  console.log(`Total bytes: ${archive.pointer()} written.`)
  console.log('archiver has been finalized and the output file descriptor has closed.')

  fs.unlinkSync('cert.pem')
  fs.unlinkSync('private.pem')
  rimraf.sync(pushPackagePath)

  const endsAt = new Date();
  console.log(`[end] generate_pushpackage. take ${endsAt - startedAt}ms`);
})

archive.pipe(output)

console.log('building Package')

rawFiles.forEach((file) => {
  archive.append(fs.createReadStream(pushPackagePath + '/' + file), {name: file})
})

archive.finalize()
