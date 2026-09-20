@echo off
echo Starting V3 infrastructure...
docker compose up -d
echo.
docker compose ps
echo.
echo Kafka UI: http://localhost:8088
echo Eureka:    http://localhost:8761  (start eureka-server separately)
pause
