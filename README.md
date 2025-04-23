## Auth Project Setup

- create `.env` file add all environment variables needed which are listed below 

```
PORT=3000
JWT_ACCESS_SECRET=secret_auth1
JWT_ONETIME_CODE_SECRET=secret_auth2
JWT_REFRESH_SECRET=secret_auth3
MAGIC_LOGIN_SECRET=secret_auth4
NODE_ENV=development
MAIL_HOST=__
MAIL_PORT=__
MAILTRAP_TOKEN=__
MAIL_USERNAME=__
MAIL_PASSWORD=__
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
MAIL_FROM=_
GOOGLE_CLIENT_ID=__
GOOGLE_CLIENT_SECRET=__
GOOGLE_CALLBACK_URL=__
DB_URL=__
```

- for jwt and magic login secret you can use your own random string characters but make sure that they are not the same secret characters

- for mail and mailtrap related variables go to [mailtrap.io](https://mailtrap.io) and sign in and start a testing server the the platform provides you host, port, username, and password. then fill each variables to the .env fields accordingly

- MAILTRAP_TOKEN is a token mailtrap provides to send real emails to yourself only you can fill that later it's optional

- for google related variables go to [Google Console](https://console.cloud.google.com). Make sure you created a project first after project creation
    - Go to Quick access section and under that section click APIs & Services
    - then click to credentials link which is found at left sidebar 
    - above the credentials navbar create a credentials 
    - and fill out all .env fields with the credentials that matched above

- for DB_URL create a mongodb atlas cloud database and paste the connection string here

- to start the server run 
    - `npm install` 
    - `npm run start`