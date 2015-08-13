#!/usr/bin/env bash

# set npm permissions
# # option 1
# sudo chown -R vagrant $(npm config get prefix)
#
# # option 2
mkdir ~/npm-global
#
npm config set prefix "$HOME/npm-global"
export PATH=~/npm-global/bin:$PATH
source ~/.profile
# # or
# env NPM_CONFIG_PREFIX=~/npm-global

# install npm packages
cd /vagrant
npm install --production
npm install -g pm2

# start node server with pm2 and create start-up script
pm2 start /vagrant/server.js
# pm2 startup output:
sudo su -c "env PATH=$PATH:/usr/bin env PM2_HOME=/home/vagrant/.pm2 pm2 startup ubuntu -u vagrant"
# -> edit: sudo nano /etc/init.d/pm2-init.sh
# -> and change: PM2_HOME="/root/.pm2"
# -> to: PM2_HOME="/home/vagrant/.pm2"
pm2 save
