#!/usr/bin/env python3
import evdev, requests

rfid_reader = evdev.InputDevice('/dev/input/event0')

print("Connected to RFID Reader")

current_code = ""
keys = "XX1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX"

def validate_code(authcode):
	with open("/home/open/rfid_codes.txt", "r") as f:
		authlines = f.readlines()

	for line in authlines:
		if line.split()[0] == authcode:
			print("Opening door")
			return True
	
	return False


for event in rfid_reader.read_loop():
	if event.type == 1 and event.value == 1:
		if event.code > len(keys):
			continue

		if keys[event.code] in "0123456789":
			current_code += keys[event.code]
		else:
			if validate_code(current_code):
				requests.get("http://127.0.0.1:8001/unlock")
			
			current_code = ""
