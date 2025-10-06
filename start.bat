@echo off
echo Starting MovieFlix Application...
echo.

echo 1. Checking if backend is running on port 5000...
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Backend is already running on port 5000
) else (
    echo Starting backend server...
    start "Backend Server" cmd /c "cd server && npm run dev"
    timeout /t 5 >nul
)

echo.
echo 2. Checking if frontend is running on port 3000...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Frontend is already running on port 3000
) else (
    echo Starting frontend...
    start "Frontend" cmd /c "npm start"
)

echo.
echo 3. Application started successfully!
echo Backend API: http://localhost:5000/api
echo Frontend: http://localhost:3000
echo Admin Login: admin@movieflix.com / SecureAdmin2024!
echo.
pause