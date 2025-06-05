@echo off
echo Running SonarCloud Analysis...
echo.

REM Using PowerShell to run sonar-scanner
powershell -Command "sonar-scanner -D'sonar.organization=eli-iie' -D'sonar.projectKey=eli-iie_APDS7311-CustomerPortal' -D'sonar.sources=.' -D'sonar.host.url=https://sonarcloud.io' -D'sonar.login=3ca93cfe1d8a0b023e5c0d0f76d12b66b6dd8ac2'"

echo.
echo Analysis complete!
pause
