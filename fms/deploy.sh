#!/bin/sh

# Make sure the followings are installed:
# - git
# - node
# - yarn

# NOTE: Run this on the root of this project

# Move to the development branch
git checkout development

# Pull the latest development changes
git pull origin development

# Create new .env file
sudo echo "BASE_URL_V2=https://api.pitik.dev/v2
ENCRYPTION_KEY=4428472B4B6250645367566B5970337336763979244226452948404D63516654
NEXT_PUBLIC_GOOGLE_CLIENT_ID=53429179701-6csltenaq0evlqsek9bfglavmsgmore1.apps.googleusercontent.com" > .env

# Install dependencies
yarn

# Start build
yarn build

if pm2 describe staging-fms 2>&1 ; then
    pm2 reload staging-fms
else
    pm2 start 'yarn start' --name staging-fms
fi
