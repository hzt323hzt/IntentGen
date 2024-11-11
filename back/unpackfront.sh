#! /bin/bash
# Set up your python env path or interpreter
tar -zxvf static.tar static
MYIPADDR="192.168.2.177:8000"
mkdir -p static
sed -i "s/localhost:8000/${MYIPADDR}/g" static/static/js/*.*