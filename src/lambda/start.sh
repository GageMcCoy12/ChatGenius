#!/bin/bash

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
fi

# Create app directory
sudo mkdir -p /home/ec2-user/app
sudo chown -R ec2-user:ec2-user /home/ec2-user/app
cd /home/ec2-user/app

# Copy files
sudo cp -r /tmp/dist/* .
sudo cp /tmp/package.json .
sudo chown -R ec2-user:ec2-user .

# Install dependencies
npm install --production

# Start the server with sudo
sudo node server.js 