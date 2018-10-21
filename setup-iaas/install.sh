#!/bin/bash

# colors in terminal
CYAN='\033[1;36m'
RED='\033[1;31m'
NC='\033[0m'

# Install script
cd
pushd .
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Preparing system packages...\n${NC}"
sudo apt -qq update -y
printf "${CYAN}Adjusting server datetime\n${NC}"
sudo dpkg-reconfigure tzdata
sudo ntpdate ntp.ubuntu.com
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling essencial packages (this operation can take several minutes)\n${NC}"
sudo apt -qq install -y gcc make build-essential
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling nodejs\n${NC}"
sudo apt -qq install -y curl
sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt -qq install -y nodejs
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Installing NGinx\n${NC}"
sudo apt -qq install -y nginx
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Configuring Ngnix\n${NC}"
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
sudo cp $HOME/fictional-palm-tree/setup-iaas/nginx-config /etc/nginx/sites-available/default
sudo nginx -s reload
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling git\n${NC}"
sudo apt -qq install -y git
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Instaling "fictional-palm-tree" project\n${NC}"
git clone https://github.com/andrentaz/fictional-palm-tree.git
cd fictional-palm-tree
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
if [ ! -e ./setup-iaas/env-vars.sh ]; then
    printf "${RED}[ERR] configuration file is required to proceed\n${NC}"
    printf "${RED}[ERR] create a file 'env-vars.sh' to config the env vars\n${NC}"
    printf "${RED}[ERR] MONGO_URI   => define the URI to the mongo db\n${NC}"
    printf "${RED}[ERR] SECRET      => define the secret to JWT tokens\n${NC}"
    printf "${RED}[ERR] Aborting.....\n${NC}"
    exit
    return 1
fi
source ./setup-iaas/env-vars.sh
pm2 start build/auth/app.js
pm2 startup ubuntu
printf "${CYAN}\n${NC}"
printf "${CYAN}[IMPORTANT] Run the previous outputted command!\n${NC}"
printf "${CYAN}==========================================================================\n${NC}"
printf "${CYAN}Finishing install.sh script\n${NC}"
popd
printf "${CYAN}==========================================================================\n${NC}"
