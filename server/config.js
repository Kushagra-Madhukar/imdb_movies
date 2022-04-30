// keys.dev.js ==========
console.log(`The current env is: ${process.env.NODE_ENV}`)

if(process.env.NODE_ENV)
require('dotenv').config({ path: `./envs/.env.${process.env.NODE_ENV}` })
else
require('dotenv').config({ path: './envs/.env.local'})


console.log(`The backend url is: ${process.env.BACKEND_URL}`)

module.exports = {
    DB_STRING: process.env.DB_STRING,//
    SECURED_COOKIE: process.env.SECURED_COOKIE,//
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN, //
    SAME_SITE_COOKIE: process.env.SAME_SITE_COOKIE, //
    BACKEND_URL: process.env.BACKEND_URL,
}