#!/bin/bash

# colors in terminal
CYAN='\033[1;36m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'

# project
PROJECT='fictional-palm-tree'
ENV_CONFIG_FILE='env-vars.sh'

# Install script
cd
pushd .
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Preparing system packages...\n${NC}"
sudo apt -qq update -y
printf "${CYAN}Adjusting server datetime\n${NC}"
sudo dpkg-reconfigure tzdata

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling essencial packages (this operation can take several minutes)\n${NC}"
sudo apt -qq install -y gcc make build-essential

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling nodejs\n${NC}"
sudo apt -qq install -y curl
sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt -qq install -y nodejs

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling git\n${NC}"
sudo apt -qq install -y git

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling '${PROJECT}' project\n${NC}"
git clone https://github.com/andrentaz/${PROJECT}.git
cd ${PROJECT}

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Installing NGinx\n${NC}"
sudo apt -qq install -y nginx

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Configuring Ngnix\n${NC}"
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
sudo cp $HOME/${PROJECT}/setup-iaas/nginx-config /etc/nginx/sites-available/default
sudo nginx -s reload

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Configuring and instaling node modules\n${NC}"
sudo npm install -g npm
sudo npm install -g forever pm2
npm install

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Building project\n${NC}"
npm run build

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Runing PM2 for server\n${NC}"
if [ -z ${SECRET} ] | [ -z ${MONGO_URI} ]
    then
    if [ ! -e ./setup-iaas/${ENV_CONFIG_FILE} ]
        then
        printf "${RED}[WARNING] configuration is required to proceed\n${NC}"
        printf "${RED}[WARNING] MONGO_URI   => define the URI to the mongo db\n${NC}"
        printf "${RED}[WARNING] SECRET      => define the secret to JWT tokens\n${NC}"
        printf "${RED}[WARNING] enter the value for the required variables or abort and create a file '${ENV_CONFIG_FILE}' in the setup dir\n${NC}"
        printf "${RED}[WARNING] (you will break your bash if empty values are assigned)\n${NC}"
        printf "${GREEN}Enter a value to SECRET: ${NC}"
        read secret
        printf "${GREEN}Enter a value to MONGO_URI: ${NC}"
        read mongo_uri
        
        printf "${CYAN}==========================================================================\n${NC}"
        printf "${CYAN}Environment config\n${NC}"
        export SECRET=${secret}
        export MONGO_URI=${mongo_uri}
        ( echo ; echo "export SECRET=${secret}"; echo "export MONGO_URI=${mongo_uri}" ) >> ~/.bashrc
    else
        source ./setup-iaas/${ENV_CONFIG_FILE}
        ( echo ; cat ./setup-iaas/${ENV_CONFIG_FILE} ) >> ~/.bashrc
    fi
fi
pm2 start build/auth/app.js
pm2 startup
printf "${CYAN}\n${NC}"
printf "${RED}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n${NC}"
printf "${RED}[IMPORTANT] Run the previous pm2 outputted command to setup the startup hook!\n${NC}"

printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Finishing install.sh script\n${NC}"
popd

printf "${CYAN}==========================================================================\n${NC}"
