#!/bin/bash

SSHKEYS_SRC=/home/pi/door_keys/authorized_keys
RFIDKEYS_SRC=/home/pi/door_keys/rfid_codes.txt

SSHKEYS_DEST_OPEN=/home/open/.ssh/authorized_keys
SSHKEYS_DEST_CLOSE=/home/close/.ssh/authorized_keys
RFIDKEYS_DEST=/home/open/rfid_codes.txt

BACKUP_ROOTDIR=/home/pi/backups

# Backup new files
backup_dir="$BACKUP_ROOTDIR/$(date +%F_%H%M%S)"
mkdir -p "$backup_dir"
cp -i "$SSHKEYS_SRC"  "$backup_dir"
cp -i "$RFIDKEYS_SRC" "$backup_dir"

# Deploy files
cat "$SSHKEYS_SRC"  | sudo tee "$SSHKEYS_DEST_OPEN"  >/dev/null
cat "$SSHKEYS_SRC"  | sudo tee "$SSHKEYS_DEST_CLOSE" >/dev/null
cat "$RFIDKEYS_SRC" | sudo tee "$RFIDKEYS_DEST"      >/dev/null

