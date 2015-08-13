#!/usr/bin/env bash

# update parallels-tools
# /usr/lib/parallels-tools/install --install-unattended --restore-on-fail --progress

# install node & npm
curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
apt-get install --yes nodejs
# optional step for node
# apt-get install --yes build-essential

# install system packages
apt-get install -y htop git curl

# Run User Configurations
su -c "source /vagrant/user-bootstrap.sh" vagrant
