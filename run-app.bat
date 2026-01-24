@echo off
echo Starting Intelligent Workflow Automation Platform...

:: Start Backend
echo Starting Backend Server...
start "WAP Backend" cmd /k "cd backend && npm run dev"

:: Start Frontend
echo Starting Frontend Client...
start "WAP Frontend" cmd /k "cd frontend && npm run dev"

echo Application started! 
echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:5173
echo.
echo Press any key to exit this launcher (servers will keep running)...
pause >nul
exit
