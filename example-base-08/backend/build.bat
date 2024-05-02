@echo off

set curr_dir=%cd%

cd D:\GIT\microservices-playground\example-base-08\backend\book
call mvn clean install -DskipTests
Echo Successfully created artifacts for : book service

cd D:\GIT\microservices-playground\example-base-08\backend\course
call mvn clean install -DskipTests
Echo Successfully created artifacts for : course service

cd D:\GIT\microservices-playground\example-base-08\backend\login
call mvn clean install -DskipTests
Echo Successfully created artifacts for : login service

cd D:\GIT\microservices-playground\example-base-08\backend\student
call mvn clean install -DskipTests
Echo Successfully created artifacts for : student service

cd D:\GIT\microservices-playground\example-base-08\backend\eurekaserver
call mvn clean install -DskipTests
Echo Successfully created artifacts for : eurekaserver

cd D:\GIT\microservices-playground\example-base-08\backend\api-gateway
call mvn clean install -DskipTests
Echo Successfully created artifacts for : api-gateway

cd D:\GIT\microservices-playground\example-base-08\backend\jwt-library
call mvn clean install -DskipTests
Echo Successfully created artifacts for : jwt-library


cd %curr_dir%

@REM docker-compose build