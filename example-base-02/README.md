# Create K8s structure for deployment of project in folder `example-base-02`
## Push Docker images to a local Docker registry

### Building Docker Images
First, navigate to each directory containing a Dockerfile and build the Docker images using the docker build command.

```shell
cd example-base-02

# Build frontend image
docker build -t frontend-base-02 ./frontend

# Build topics backend image
docker build -t topics-base-02 ./backend/topic

# Build words backend image
docker build -t words-base-02 ./backend/word

```

### Tagging Images for Local Registry

Next, tag each image with the address of your local Docker registry (localhost:5000).

```shell
# Tag frontend image
docker tag frontend-base-02 localhost:5000/frontend

# Tag topics backend image
docker tag topics-base-02 localhost:5000/topic

# Tag words backend image
docker tag words-base-02 localhost:5000/word
```

### Run the Docker Registry Container
Run the following command to start a Docker Registry container:

```shell
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

This command will start a Docker Registry container named registry on port 5000 of your local machine.

### Pushing Images to Local Registry
After tagging the images, you can push them to your local Docker registry using the `docker push` command.

```shell
# Push frontend image
docker push localhost:5000/frontend

# Push topics backend image
docker push localhost:5000/topic

# Push words backend image
docker push localhost:5000/word
```

### Verify Images in Local Registry
You can verify that your images are successfully pushed to the local Docker registry by using the `docker images` command:

```bash
docker images localhost:5000/*
```
This command will list all images stored in the local Docker registry.

```powershell
PS D:\GIT\microservices-playground\example-base-02> docker images localhost:5000/*
REPOSITORY                TAG       IMAGE ID       CREATED             SIZE
localhost:5000/frontend   latest    e47306d5efd7   About an hour ago   490MB
localhost:5000/topic      latest    78b7d10994a0   About an hour ago   241MB
localhost:5000/word       latest    06bfb92f78fe   About an hour ago   241MB
```

## Create and place Kubernetes YAML configuration files
In a typical Kubernetes project structure, Kubernetes YAML configuration files are often stored in a directory named `kubernetes` or `k8s`, located at the root of the project. This convention helps keep all Kubernetes-related files organized in one place.

So, in your case, you can create a directory named `kubernetes` at the root of your project (`example-base-02`) and place all your Kubernetes YAML configuration files within it.

Here's an example of how your project structure might look after organizing the Kubernetes YAML configuration files:
```lua
example-base-02/
|-- backend/
|   |-- topics/
|   |   |-- Dockerfile
|   |-- words/
|       |-- Dockerfile
|-- frontend/
|   |-- Dockerfile
|-- kubernetes/
|   |-- topics-deployment.yaml
|   |-- words-deployment.yaml
|   |-- frontend-deployment.yaml
|   |-- topics-service.yaml
|   |-- words-service.yaml
|   |-- frontend-service.yaml
|   |-- ingress.yaml (optional)

```


## Applying Configurations
Apply the Kubernetes YAML configuration files using `kubectl apply -f <file_name>` command:

```bash
kubectl apply -f topics-deployment.yaml
kubectl apply -f words-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f topics-service.yaml
kubectl apply -f words-service.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml  # Optional for exposing frontend service via Ingress

```

## To start a Kubernetes (k8s) cluster
To start a Kubernetes (k8s) cluster, you have a few options depending on your requirements and environment. Here are two common methods:

### Using Minikube (for local development and testing):

Minikube is a tool that allows you to run a single-node Kubernetes cluster locally on your machine. It's a great option for development and testing purposes.

To start a Minikube cluster, you'll first need to install Minikube. You can find installation instructions for your operating system on the official Minikube GitHub repository: https://github.com/kubernetes/minikube#installation

Once Minikube is installed, you can start a cluster by running the following command in your terminal:

```shell

minikube start
```

This command will start a local Kubernetes cluster using a virtual machine manager (such as VirtualBox or Docker).

### Using a Cloud Provider (for production or multi-node clusters):

If you're setting up a production environment or need a multi-node Kubernetes cluster, you can use a cloud provider such as AWS, Google Cloud Platform (GCP), or Azure.

Each cloud provider offers managed Kubernetes services (EKS for AWS, GKE for GCP, AKS for Azure) that make it easy to create and manage Kubernetes clusters in the cloud. You can follow the documentation provided by your chosen cloud provider to create a Kubernetes cluster.

For example, with AWS EKS, you would typically use the AWS Management Console, AWS CLI, or AWS CloudFormation to create and manage your Kubernetes cluster. The process involves creating an EKS cluster, configuring access permissions, and connecting to the cluster using kubectl.

Choose the method that best suits your needs based on whether you're developing locally or deploying to a production environment. If you're just getting started with Kubernetes, Minikube is a good option for local development and testing.

## minikube start
minikube is local Kubernetes, focusing on making it easy to learn and develop for Kubernetes.

All you need is Docker (or similarly compatible) container or a Virtual Machine environment, and Kubernetes is a single command away: `minikube start`

### To install the latest minikube stable release on x86-64 Windows using .exe download
1. Download and run the installer for the latest release.
Or if using PowerShell, use this command:
```powershell
New-Item -Path 'c:\' -Name 'minikube' -ItemType Directory -Force
Invoke-WebRequest -OutFile 'c:\minikube\minikube.exe' -Uri 'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe' -UseBasicParsing
```
2. Add the `minikube.exe` binary to your PATH.
Make sure to run PowerShell as Administrator.
```powershell
$oldPath = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::Machine)
if ($oldPath.Split(';') -inotcontains 'C:\minikube'){
  [Environment]::SetEnvironmentVariable('Path', $('{0};C:\minikube' -f $oldPath), [EnvironmentVariableTarget]::Machine)
}
```

If you used a terminal (like powershell) for the installation, please close the terminal and reopen it before running minikube.


## 
