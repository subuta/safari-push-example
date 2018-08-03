import dotenv from 'dotenv'
import fs from 'fs'
import pushLib from 'safari-push-notifications'
import childProcess from 'child_process'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'

import {
  ICON_DIR,
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

const pushPackagePath = `${PUBLIC_DIR}/safari-push-example.pushpackage.zip`

const startedAt = new Date();
console.log('[start] generate_pushpackage.');

if (fs.existsSync(PUBLIC_DIR)) {
  rimraf.sync(PUBLIC_DIR)
}

mkdirp.sync(PUBLIC_DIR)

// Generate pem from cer(Intermediate certificate)
childProcess.execSync('openssl x509 -inform der -in AppleWWDRCA.cer -out AppleWWDRCA.pem')

// Generate cert & private key from `.p12` file.
childProcess.execSync(`openssl pkcs12 -in ${CERT_P12_FILENAME} -out crt.pem -clcerts -nokeys -passin pass:'${CERT_P12_PASSWORD}'`)
childProcess.execSync(`openssl pkcs12 -in ${CERT_P12_FILENAME} -out key.pem -nocerts -nodes -passin pass:'${CERT_P12_PASSWORD}'`)

const websiteJson = pushLib.websiteJSON(
  WEBSITE_NAME, // websiteName
  WEBSITE_PUSH_ID, // websitePushID
  [ALLOWED_DOMAIN], // allowedDomains
  URL_FORMAT_STRING, // urlFormatString
  AUTHENTICATION_TOKEN, // authenticationToken (zeroFilled to fit 16 chars)
  WEB_SERVICE_URL // webServiceURL (Must be https!)
)

pushLib.generatePackage(
  websiteJson, // The object from before / your own website.json object
  ICON_DIR,
  fs.readFileSync('crt.pem'), // Certificate
  fs.readFileSync('key.pem'), // Private Key
  fs.readFileSync('AppleWWDRCA.pem') // Intermediate certificate
)
  .pipe(fs.createWriteStream(pushPackagePath))
  .on('finish', function () {
    // Generate temporary files.
    fs.unlinkSync('crt.pem')
    fs.unlinkSync('key.pem')
    fs.unlinkSync('AppleWWDRCA.pem')

    const endsAt = new Date();
    console.log(`[end] generate_pushpackage. take ${endsAt - startedAt}ms`);
  })
