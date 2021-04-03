# DRP - Site Checker
Disaster Recovery Plan - Site checker

Checks given site for availability - if not fixed after amount of times checked. Notify users via email.

## Flow of this tool:

- 1) Checks given site every given frequency (uses cron)
- 2) If that site is not giving a status code 200 or gives a timeout. 
     It checks that site again after a given amount of minutes
- 3) If that site is still unavailable it sends an email to the given admin email.
- 4) When the DRP has found that the site is down for a given amount of times it also sends an email to an email list.

## How to use

- Use as Docker container:
    - Use with .env file:

    ```bash
    #Fill in all the .env.local fields
    docker run --name drp -t ghcr.io/snakehead007/drp:latest --env-file ./.env.local
    ```
    - Use with env variables:
    ```bash
    #For info about a variable, check the .env.local file
    docker run --name drp -t ghcr.io/snakehead007/drp:latest /
    --env URL="123456789.com" /
    --env FREQUENCY="0 * * * *" /
    --env MAXFAILURECOUNTER=24 /
    --env ADMINEMAIL="admin@mail.com" /
    --env EMAILLIST="employee1@company.be,employee2@company.be" /
    --env EMAILTEXT="this is an example\DRP notification" /
    --env EMAILSUBJECT="Site is down - notification" /
    --env TIMEOUT=3000 /
    --env FROMEMAIL="notification@drp.com"
    --env WAITUNTILRECHECK=5 /
    --env SMTPSERVER="smtp.server.com" /
    --env SMTPPASSWORD="abc123" /
    --env SMTPPORT=587
    ```

- From source
    - Clone this repository

    - Fill in .env.local

    - `cp .env.local .env`

    - uncomment `index.js:1` (`require('dotenv').config();`)

    - `yarn install` or `npm install`

    - `node .`