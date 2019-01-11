#!/usr/bin/env python3
import requests

print("Locking door...")
requests.get("http://127.0.0.1:8001/lock")