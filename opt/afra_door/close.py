#!/usr/bin/env python3
import requests

with open("/opt/afra_door/secrets/shared_secret", "r") as f:
	shared_secret = f.read()

print("Locking door...")
requests.get("http://127.0.0.1:8001/lock?shared_secret={}".format(shared_secret))
