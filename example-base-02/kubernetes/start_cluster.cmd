@echo off

REM Start Minikube
echo Starting Minikube...
minikube start

REM Apply Kubernetes configurations
echo Applying Kubernetes configurations...
kubectl apply -f topics-deployment.yaml
kubectl apply -f words-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f topics-service.yaml
kubectl apply -f words-service.yaml
kubectl apply -f frontend-service.yaml

REM Expose Frontend Service
echo Exposing Frontend Service...
kubectl apply -f frontend-nodeport-service.yaml

REM Get Frontend Service URL
echo Getting Frontend Service URL...
minikube service frontend-nodeport-service --url
