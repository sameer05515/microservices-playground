@echo off

echo build and push image for : fontend_base_01
docker build -t fontend_base_01 D:\GIT\microservices-playground\example-base-01\frontend
docker tag fontend_base_01 fontend_base_01:01
docker tag fontend_base_01:01 sameer426/fontend_base_01:01
docker push sameer426/fontend_base_01:01

echo build and push image for : topics_base_01
docker build -t topics_base_01 D:\GIT\microservices-playground\example-base-01\backend\topic
docker tag topics_base_01 topics_base_01:01
docker tag topics_base_01:01 sameer426/topics_base_01:01
docker push sameer426/topics_base_01:01

echo build and push image for : words_base_01
docker build -t words_base_01 D:\GIT\microservices-playground\example-base-01\backend\word
docker tag words_base_01 words_base_01:01
docker tag words_base_01:01 sameer426/words_base_01:01
docker push sameer426/words_base_01:01

