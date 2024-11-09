#! /bin/bash
# Set up your python env path or interpreter
mkdir -p static
pycmd=~/.py/bin/python3
$pycmd -m fastapi run main.py --port=8000