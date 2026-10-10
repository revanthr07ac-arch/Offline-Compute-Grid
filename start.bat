@echo off
echo Starting Offline Compute Grid Backend...
start cmd /k "cd backend && npm install && npm run dev"

echo Starting Offline Compute Grid Frontend...
start cmd /k "npm install && npm run dev"

echo Waiting for servers to start...
ping 127.0.0.1 -n 8 > nul

echo Opening browser...
start http://localhost:8443

echo Both servers are starting up! You can close this window.
exit
