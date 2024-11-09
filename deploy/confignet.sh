#! /bin/bash
set -e
sudo mkdir -p /etc/nginx/sites-available/
sudo cp intentgen /etc/nginx/sites-available/
sudo mkdir -p /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/home_legion /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

