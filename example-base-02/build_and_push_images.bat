@echo off

REM Build frontend image
echo Building frontend image...
docker build -t frontend-base-02 frontend

REM Build topics backend image
echo Building topics backend image...
docker build -t topics-base-02 backend\topic

REM Build words backend image
echo Building words backend image...
docker build -t words-base-02 backend\word

REM Tag frontend image
echo Tagging frontend image...
docker tag frontend-base-02 localhost:5000/frontend

REM Tag topics backend image
echo Tagging topics backend image...
docker tag topics-base-02 localhost:5000/topic

REM Tag words backend image
echo Tagging words backend image...
docker tag words-base-02 localhost:5000/word

REM Push frontend image
echo Pushing frontend image...
docker push localhost:5000/frontend

REM Push topics backend image
echo Pushing topics backend image...
docker push localhost:5000/topic

REM Push words backend image
echo Pushing words backend image...
docker push localhost:5000/word

REM List images in local Docker registry
echo Listing images in local Docker registry...
docker images localhost:5000/*
