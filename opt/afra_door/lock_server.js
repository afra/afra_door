// Require the keyble module
var keyble = require("keyble");
var http = require("http");
var url = require("url")
var fs = require("fs");

// Increase max listeners to make the server a bit more stable regarding 'MaxListenersExceededWarning'
require('events').EventEmitter.defaultMaxListeners = 30;

// Create a new Key_Ble instance that represents one specific door lock
var key_ble = new keyble.Key_Ble({
	address: "00:1a:22:09:8b:d7", // The bluetooth MAC address of the door lock
	user_id: 1, // The user ID
	user_key: fs.readFileSync("/opt/afra_door/secrets/user.key", "utf8"),
	auto_disconnect_time: 0, // After how many seconds of inactivity to auto-disconnect from the device (0 to disable)
	status_update_time: 60 // Automatically check for status after this many seconds without status updates (0 to disable)
});

var shared_secret = fs.readFileSync("/opt/afra_door/secrets/shared_secret", "utf8")

console.log("Connected to AFRA lock")

var current_door_status = "UNKNOWN";

// Listen for door status changes
key_ble.on("status_change", (new_status_id, new_status_string) => {
	console.log("door status changed:", new_status_string);
	current_door_status = new_status_string;
});

// Request start status
key_ble.request_status();

function status_door() {
	return current_door_status;
}

function lock_door(){
	ts = Math.round((new Date()).getTime() / 1000)
	console.log("Starting polling at " + ts)

	// Unlock the door
	key_ble.lock()
	.then( () => {
		console.log("Door locked at " + Math.round((new Date()).getTime() / 1000));
	});
}

function unlock_door(){
	ts = Math.round((new Date()).getTime() / 1000)
	console.log("Starting polling at " + ts)

	// Unlock the door
	key_ble.unlock()
	.then( () => {
		console.log("Door unlocked at " + Math.round((new Date()).getTime() / 1000));
	});
}

function toggle_door() {
	// Check status
	if (status_door() === "UNLOCKED") {
		console.log("Toggling door: locking...");
		lock_door();
	}
	else {
		console.log("Toggling door: unlocking...");
		unlock_door();
	}
}

// HTTP server on port 8001, only listening on localhost
http.createServer(function (req, res) {
	var q = new url.URL("http://127.0.0.1" + req.url)

	if (q.searchParams.get("shared_secret") === shared_secret){
		if (q.pathname === "/unlock"){
			if (status_door() === "UNLOCKED") {
				// Status code 409 CONFLICT
				res.statusCode = 409;
				res.write("Door is already UNLOCKED! Try to unlock anyway...");
			}
			else {
				res.write("Opening lock...")
			}
			unlock_door()
		}
		else if (q.pathname === "/lock"){
			if (status_door() === "LOCKED") {
				// Status code 409 CONFLICT
				res.statusCode = 409;
				res.write("Door is already LOCKED! Try to lock anyway...");
			}
			else {
				res.write("Closing lock...")
			}
			lock_door()
		}
		else if (q.pathname === "/toggle"){
			res.write("Toggling lock (current status: " + status_door() + ")");
			toggle_door();
		}
	}
	else{
		console.log("Request rejected")
	}
	res.end(); //end the response
}).listen(8001, "127.0.0.1");

// Public HTTP server on port 8080, only for door status
http.createServer(function (req, res) {
	//console.log("Request on public port 8080");
	res.write("Door status: " + status_door() + "\n");
	res.end();
}).listen(8080);
