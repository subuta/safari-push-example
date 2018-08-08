# safari-push-example
Node.js server &amp; browser client example of Safari Push Notifications using APNS.

![demo](https://user-images.githubusercontent.com/6227288/43837030-2eeb2f8e-9b52-11e8-9bd6-dd77d4d1032d.gif)

### References

- [Notification Programming Guide for Websites](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html)
- [How to Implement Safari Push Notifications on Your Website](http://samuli.hakoniemi.net/how-to-implement-safari-push-notifications-on-your-website/)

### Prerequisites

- [Active Membership of iOS Developer Account](https://developer.apple.com/account/#/overview/4579AZ8Q4Z)
- `openssl` can be installed by `brew install openssl`
- [ngrok](https://ngrok.com/) for serve https server easily with valid ssl certificate :)
  - Run `npm start` will also serve https pages(with self-signed pem) at `https://localhost:5001`, But that won't work with Safari Push Notification...

> Important: Make sure that your web server is using a real certificate issued from a Certificate Authority, not a self-signed certificate. If your certificate is self-signed, push notifications won’t reach your users.
>
> Reference: https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html

### How to develop

#### Preparation

```
# 1. Clone this repo.

git clone https://github.com/subuta/safari-push-example

# 2. Download latest certificate from apple and put it to root of this repo.

wget https://developer.apple.com/certificationauthority/AppleWWDRCA.cer

# 3. Create development certificate on http://developer.apple.com
# 3-1. Login to http://developer.apple.com

# 3-2-1. Then navigate to https://developer.apple.com/account/
# 3-2-2. Click `Certificates, IDs & Profiles` on the left pane.
# 3-2-3. Go to `Website Push IDs` of Identifiers section, and click plus icon to add id.
# 3-2-4. Fill these fields, and click `Continue`
# - Website Push ID Description: ex. Safari Push Example
# - Identifier: ex. web.com.xxx.xxx
# 3-2-5. Click `Register` at confirmation page.
# 3-2-6. Then click `Done` to finish adding Website Push ID.

# 3-3-1. Go to `All` of Certificates section, and click plus icon to add id.
# 3-3-2. Fill these fields, and click `Continue`
# - Choose `Website Push ID Certificate` of Production section.
# 3-3-3. At App ID selection, choose Website Push ID created at previous step, and click `Continue`.
# 3-3-4. Follow the shown steps and Create a Certificate Signing Request (CSR)*[]:
# SEE: https://help.apple.com/developer-account/#/devbfa00fef7
# 3-3-5. Click `Choose File...` and select CSR file(created at previous step), and click `Continue`.
# 3-3-6. Click `Download` button for download your certificate :)

# 3-4-1. Obtain an Encryption Key and Key ID from Apple
# SEE: https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_token_based_connection_to_apns
# 3-4-2. Go to `All` of Keys section, and click plus icon to add Key.
# 3-4-3. Fill these fields, and click `Continue`
# - Name: ex. Safari Push Example
# - Choose `Apple Push Notifications service (APNs)` of Key Services section.
# 3-4-4. Click `Confirm` at confirmation page.
# 3-4-5. Click `Download` button for download your key :)
# 3-4-6. Then click `Done` to finish adding Encryption Key.
# 3-4-7. Move saved file(ex. `AuthKey_A1BC23DE45.p8`) to root of this repo.

# 4. Install certificate and export as a .p12 File
# 4-1. Double click cerificate file(Named like `website_aps_production.cer`) downloaded at step #3-3-6
# 4-2. Find installed cerificate(Named like `Website Push ID: ${Website Push ID}`) at keychain.
# 4-3. Drag and drop it to `login` keychain if it exists at `System`
# SEE: https://stackoverflow.com/a/21060610
# 4-4. Right click cerificate, and select `Export "..."`
# 4-5. Select `Personal Information Excange(.p12)` at File Format, and click `Save`.
# 4-6. Fill Password/Verify and. click `OK` for save file.
# 4-7. Move saved file(ex. `Certificates.p12`) to root of this repo.

# 5. Copy `.env-example` as `.env` and fill variables.
```

#### Build & Start server

1. Run `npm i` to for install dependencies.
2. Run `npm run build` to generate PushPackage and build assets.
3. Run `npm start` for starting server.
4. Run `ngrok http 5000` for serving pages with valid ssl certificate and open that page(eg: `https://xxxxxxxx.ngrok.io`)!