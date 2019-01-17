#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time, os, requests

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN)
GPIO.setup(27, GPIO.OUT)

with open("/opt/afra_door/secrets/shared_secret", "r") as f:
	shared_secret = f.read()

def trigger_door_close():
		print("Closing door by button")
		for i in range(0, 20):
			GPIO.output(27, GPIO.HIGH)
			time.sleep(0.25)
			GPIO.output(27, GPIO.LOW)
			time.sleep(0.25)

		requests.get("http://127.0.0.1:8001/lock?shared_secret={}".format(shared_secret))
		

GPIO.output(27, GPIO.LOW)
while True:
	if GPIO.input(17) == 1: 
		trigger_door_close()
	
	time.sleep(0.5)

