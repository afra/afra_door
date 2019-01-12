// Require the keyble module
var keyble = require("keyble");
var http = require("http");
var url = require("url")
var fs = require("fs");

// Create a new Key_Ble instance that represents one specific door lock
var key_ble = new keyble.Key_Ble({
	address: "00:1a:22:09:8b:d7", // The bluetooth MAC address of the door lock
	user_id: 1, // The user ID
	user_key: fs.readFileSync("/opt/afra_door/secrets/user.key", "utf8"),
	auto_disconnect_time: 0, // After how many seconds of inactivity to auto-disconnect from the device (0 to disable)
	status_update_time: 120 // Automatically check for status after this many seconds without status updates (0 to disable)
});

var shared_secret = fs.readFileSync("/opt/afra_door/secrets/shared_secret", "utf8")

console.log("Connected to AFRA lock")

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

http.createServer(function (req, res) {
	var q = url.parse(req.url, true)

	if (q.searchParams.get("shared_secret") === shared_secret){
		if (q.pathname === "/unlock"){
			res.write("Opening lock")
			unlock_door()
		}
		else if (q.pathname === "/lock"){
			res.write("Closing lock")
			lock_door()
		}
	}
	res.end(); //end the response
}).listen(8001, "127.0.0.1"); //the server object listens on port 8080
