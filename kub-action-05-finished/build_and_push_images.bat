@echo off

REM Build backend image
echo Building backend image...
docker build -t backend-action-05 .

REM Tag backend image
echo Tagging backend image...
docker tag backend-action-05 localhost:5000/backend-ation-05:1

REM Push backend image
echo Pushing backend image...
docker push localhost:5000/backend-ation-05:1