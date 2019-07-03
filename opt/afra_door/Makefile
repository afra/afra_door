TARGET_USERHOST := pi@door
TARGET_DIR := /opt/afra_door

RSYNC_EXCLUDES := --exclude=secrets --exclude=node_modules --exclude=Makefile

.PHONY: push

# Default target
all:

# Push code to Pi
push:
	rsync -av ${RSYNC_EXCLUDES} ./ ${TARGET_USERHOST}:${TARGET_DIR}/

