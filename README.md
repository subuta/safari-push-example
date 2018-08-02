# safari-push-example
Node.js server &amp; browser client example of Safari Push Notifications using APNS.

### Prerequisites

- [Active Membership of iOS Developer Account](https://developer.apple.com/account/#/overview/4579AZ8Q4Z)

### How to develop

```
# 1. Clone this repo.

git clone https://github.com/subuta/safari-push-example

# 2. Download latest certificate from apple and put it to root of this repo.

wget https://developer.apple.com/certificationauthority/AppleWWDRCA.cer

# 3. Create development certificate on http://developer.apple.com
# 3-1. Login to http://developer.apple.com

# 3-2-1. Then navigate to https://developer.apple.com/account/
# 3-2-2. Click `Certificates, IDs & Profiles` on the left pane.
# 3-2-3. Go to `App IDs` of Identifiers section, and click plus icon to add id.
# 3-2-4. Fill these fields, and click `Continue`
# - App ID Description
# - Choose `Explicit App ID` and put Bundle ID
# - Enable `Push Notifications` at App Services section.
# 3-2-5. At confirm page, make sure `Push Notifications` are enabled(become Configurable), and then click `Register`
# 3-2-6. Then click `Done` to finish adding App ID.

# 3-3-1. Go to `Development` of Certificates section, and click plus icon to add id.
# 3-3-2. Fill these fields, and click `Continue`
# - Choose `Apple Push Notification service SSL (Sandbox)` of Development section.
# 3-3-3. At App ID selection, choose App ID created at previous step, and click `Continue`.
# 3-3-4. Follow the shown steps and Create a Certificate Signing Request (CSR)*[]:
# SEE: https://help.apple.com/developer-account/#/devbfa00fef7
# 3-3-5. Click `Choose File...` and select CSR file(created at previous step), and click `Continue`.
# 3-3-6. Click `Download` button for download your certificate :)

# 4. Install development certificate and export as a .p12 File
# 4-1. Double click cerificate file downloaded at step #3-3-6
# 4-2. Find installed cerificate(Named like `Apple Development IOS Push Services: ${Bundle ID}`) at keychain.
# 4-3. Drag and drop it to `login` keychain if it exists at `System`
# SEE: https://stackoverflow.com/a/21060610
# 4-4. Right click cerificate, and select `Export "..."`
# 4-5. Select `Personal Information Excange(.p12)` at File Format, and click `Save`.
# 4-6. Fill Password/Verify and. click `OK` for save file.
# 4-7. Move saved file(`xxx.p12`) to root of this repo.

# 5. Copy `.env-example` as `.env` and fill variables.

# 6. Run `npm i` to for install dependencies.

# 7. Run `npm run build-pp` to generate PushPackage.
```