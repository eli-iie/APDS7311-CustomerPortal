@echo off
echo Running SonarCloud Analysis with focus on hotspots and code smells...
echo.

REM Using PowerShell to run sonar-scanner with assignment-specific focus on hotspots and code smells
powershell -Command "sonar-scanner -D'sonar.organization=eli-iie' -D'sonar.projectKey=eli-iie_APDS7311-CustomerPortal' -D'sonar.sources=.' -D'sonar.host.url=https://sonarcloud.io' -D'sonar.login=3ca93cfe1d8a0b023e5c0d0f76d12b66b6dd8ac2' -D'sonar.security.hotspots.enable=true' -D'sonar.security.enableCodeSmells=true'"

echo.
echo Analysis complete! Check SonarCloud dashboard for hotspots and code smells.
pause
