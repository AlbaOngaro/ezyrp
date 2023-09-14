#!/bin/bash

# turn on bash's job control
set -m

function start() {
	surreal start --bind 0.0.0.0:8080 --allow-all --auth --user $SURREAL_USER --pass $SURREAL_PASS --log debug file://data/srdb.db
}

function import() {
	for _ in `seq 1 40` 
	do
		echo -n .
		sleep 0.25
		surreal isready --conn http://0.0.0.0:8080 && surreal import --conn http://0.0.0.0:8080 --user $SURREAL_USER --pass $SURREAL_PASS --ns crm --db crm schema.surql && break;
	done
}

# Start the primary process and put it in the background
start & import

# now we bring the primary process back into the foreground
# and leave it there
fg %1