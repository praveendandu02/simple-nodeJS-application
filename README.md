# simple-nodeJS-application

In this example, the Pipeline:

Checks out the source code for a Node.js application from a Git repository in the Checkout stage.
Installs dependencies and runs tests in the Build and test stage.
Builds a Docker image and tags it with the Git commit hash in the Build Docker image stage.
Pushes the Docker image to a container registry using credentials stored in Jenkins in the Push Docker image stage.
Applies the Kubernetes deployment and service YAML files to the cluster in the Deploy to Kubernetes stage.
Waits for the service to become available and verifies the deployment in the Verify deployment stage.

The usernameVariable and passwordVariable arguments are used to store the Docker registry credentials securely in Jenkins. You can assign values to these variables in one of two ways:

Using Jenkins Credentials: In the Jenkins UI, navigate to "Credentials" and create a new "Username with Password" credential with the ID my-registry-creds. Then, in the pipeline script, use the withCredentials step to retrieve the username and password and store them in the DOCKER_USERNAME and DOCKER_PASSWORD environment variables:

```
withCredentials([usernamePassword(credentialsId: 'my-registry-creds',
                                          usernameVariable: 'DOCKER_USERNAME',
                                          passwordVariable: 'DOCKER_PASSWORD')]) {
    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
    sh "docker push my-app:${env.GIT_COMMIT}"
}
```
To upload only the Minikube config and use it with the withKubeConfig step in your Jenkins pipeline, you can use the following steps:

Make sure the context for the Minikube cluster is currently set in your Kubernetes configuration file. You can check the current context by running the command kubectl config current-context. If the current context is not set to the Minikube cluster, switch to it by running the command kubectl config use-context <context-name>.

Extract the configuration for the Minikube cluster from your Kubernetes configuration file by running the command kubectl config view --minify --context=<minikube-context> > minikube-config.yaml, where <minikube-context> is the context name for the Minikube cluster.

Store the minikube-config.yaml file securely on the Jenkins server. You can create a new Jenkins credential of type "Secret file" and upload the minikube-config.yaml file as the secret file.

In your Jenkins pipeline script, use the withKubeConfig step with the credentialsId argument set to the ID of the Jenkins credential created in step 3:

```
    stage('Deploy to Kubernetes') {
        // Set up the Kubernetes configuration
        withKubeConfig([credentialsId: 'my-kubeconfig',
                        serverUrl: 'https://localhost:8443']) {
            // Apply the Kubernetes deployment and service YAML files
            sh 'kubectl apply -f my-deployment.yaml -f my-service.yaml'
        }
    }
```




