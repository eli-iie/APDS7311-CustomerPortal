@echo off
echo Starting Customer Payment Portal Servers...

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && node index.js"

timeout /t 5

echo Starting Frontend Server... 
start "Frontend Server" cmd /k "cd client && npm start"

echo Servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
pause
