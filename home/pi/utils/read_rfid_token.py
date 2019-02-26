#!/usr/bin/env python3
import evdev, requests, hashlib, sys

keys = "XX1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX"

try:
	rfid_reader = evdev.InputDevice('/dev/input/event0')
	print("Connected to RFID Reader")

	current_code = ""
	for event in rfid_reader.read_loop():
		if event.type == 1 and event.value == 1:
			if event.code > len(keys):
				continue

			if keys[event.code] in "0123456789":
				current_code += keys[event.code]
			else:
				md5_code = hashlib.md5(current_code.encode()).hexdigest()
				print(current_code + " " + md5_code)
				current_code = ""
except KeyboardInterrupt:
	sys.exit(0)
