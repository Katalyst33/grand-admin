#!/bin/bash
########
# This file should be one step behind project folder;
# Run: `mv update.sh ../update`
# i.e Move update.sh to ../update
########

thisDirectory="${PWD}"

function say() {
  # shellcheck disable=SC2145
  echo "=> $@"
}
function updateFront() {
  say "Updating Front End..."
  # Run commands
  cd "${thisDirectory}/h2o-front" && git pull origin main && yarn && npm run build-tsc
}


function updateServer() {
  say "Updating Server..."
  #  Run commands
  cd "${thisDirectory}/h2o-server" && git pull origin master && yarn && xjs @stack tsc && pm2 restart all
}

# if cli command is front then updateFront
if [ "$1" = "front" ]; then
  updateFront
  exit
fi
# if cli command is server then updateServer
if [ "$1" = "server" ]; then
  updateServer
  exit
fi

say "Starting Automation..."

# Update Front End
updateFront
# Update Server Side
updateServer

say "Automation Completed!"
