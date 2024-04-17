# Redeploy your applications using the provided YAML files

To redeploy your applications using the provided YAML files, you can follow these steps:

1. **Apply Deployment YAMLs:** Apply the Deployment YAML files to update the deployments of your applications. Use the ```kubectl apply -f <filename.yaml>``` command for each deployment file.

    ```bash
    kubectl apply -f smbg-deployment.yaml
    kubectl apply -f frontend-base-01-deployment.yaml
    kubectl apply -f topics-base-01-deployment.yaml
    kubectl apply -f words-base-01-deployment.yaml
    ```

2. **Apply Service YAMLs:** Apply the Service YAML files to update the services associated with your applications. Again, use the ```kubectl apply -f <filename.yaml>``` command for each service file.

    ```bash
    kubectl apply -f smbg-service.yaml
    kubectl apply -f frontend-base-01-service.yaml
    kubectl apply -f topics-base-01-service.yaml
    kubectl apply -f words-base-01-service.yaml
    ```

    By running these commands, Kubernetes will update the deployments and services based on the configurations provided in the YAML files. Make sure you are in the directory containing the YAML files, or provide the full path to each file.

    After applying these changes, Kubernetes will handle the redeployment of your applications with the updated configurations. You can monitor the deployment status using ```kubectl get deployments``` and verify the service configurations with ```kubectl get services```.

3. **check all pods**

    ```bash
    kubectl get pods
    ```
4. **check all services**

    ```bash
    kubectl get svc
    ```
    
5. **Run pods in browser**

    ```bash
    minikube service smbg
    minikube service frontend-base-01
    minikube service topics-base-01
    minikube service words-base-01
    ```

6. **Delete minikube cluster and all resources**

    To clean up Minikube and reset it to its initial state, you can use the minikube delete command. Here's how you can do it:

    1. **Stop Minikube:** First, stop the Minikube cluster if it's currently running:

    ```bash
    minikube stop 
    ```

    2. **Delete Minikube:** Once the cluster is stopped, you can delete the Minikube VM and any associated resources using the following command:

    ```bash
    minikube delete
    ```

    This command will remove the Minikube VM and all its associated resources, including the Kubernetes cluster, virtual disks, and network settings.
    
    After running these commands, Minikube will be completely cleaned up, and you can start fresh if needed by creating a new Minikube cluster using ```minikube start```. Keep in mind that deleting Minikube will permanently remove all data associated with the cluster, so make sure to back up any important data before proceeding.

# next topics

TBD