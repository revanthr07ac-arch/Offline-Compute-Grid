@echo off
echo Starting Offline Compute Grid Backend...
start "Backend Server (Port 3001)" cmd /k "cd backend && call npm run start"

echo Starting Offline Compute Grid Frontend...
start "Frontend Server (Port 8443)" cmd /k "call npm run dev"

echo Waiting for servers to start...
ping 127.0.0.1 -n 6 > nul

echo Opening browser...
start http://localhost:8443

echo Both servers are starting up!
exit
