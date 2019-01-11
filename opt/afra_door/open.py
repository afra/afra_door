#!/usr/bin/env python3
import requests

print("Welcome to AfRA, opening door...")
requests.get("http://127.0.0.1:8001/unlock")