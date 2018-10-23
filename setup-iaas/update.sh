#!/bin/bash

# colors in terminal
CYAN='\033[1;36m'
RED='\033[1;31m'
NC='\033[0m'

# project
PROJECT='fictional-palm-tree'

# Update script
pushd .
cd ~/${PROJECT}
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Downloading '${PROJECT}'\n${NC}"
git remote update
git checkout master

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse ${1:-'@{u}'})

if [ ${LOCAL} = ${REMOTE} ]
    then
    printf "${CYAN}'${PROJECT}' is up-to-date, nothing to do here\n"
    exit
fi

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Updating and reinstalling '${PROJECT}'\n${NC}"
git pull origin master
npm install

if ! grep -q "postinstall" package.json
    then
    npm run build
fi

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Removing service\n${NC}"
pm2 unstartup
pm2 remove app
pm2 start build/auth/app.js
pm2 startup

printf "${CYAN}\n${NC}"
printf "${CYAN}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n${NC}"
printf "${RED}[IMPORTANT] Run the previous pm2 outputted command to setup the startup hook!\n${NC}"

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Finishing update.sh script\n${NC}"
popd

printf "${CYAN}==========================================================================\n${NC}"
