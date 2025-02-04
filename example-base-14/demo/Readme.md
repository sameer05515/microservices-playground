# To create docker image and run

```
mvn clean package -DskipTests

docker build -t spring-hello:21 .

docker run -p 8080:8080 spring-hello:21

```

# push image

```shell
# tag image with your dockerhub username
docker tag spring-hello:21 sameer426/spring-hello:21

# push to dockerhub
docker push sameer426/spring-hello:21
```

# k8s commands

```shell
# start cluster (if not running)
minikube start

# point docker CLI to minikube's docker (so image available inside cluster)
eval $(minikube -p minikube docker-env)

# build docker image inside minikube
docker build -t spring-hello:21 .

# apply manifests
kubectl apply -f k8s/backend-deployment.yaml

# check pods
kubectl get pods -l app=spring-hello

# expose service URL
minikube service spring-hello-service --url
```