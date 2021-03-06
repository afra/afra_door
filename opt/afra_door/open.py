#!/usr/bin/env python3
import requests

with open("/opt/afra_door/secrets/shared_secret", "r") as f:
	shared_secret = f.read()

print("Welcome to AfRA, opening door...")

# Try to unlock door
response = requests.get("http://127.0.0.1:8001/unlock?shared_secret={}".format(shared_secret))

if response.status_code != 200:
	print(response.text)

