node {
    stage('Checkout') {
        // Check out the source code for this project
        git url: 'https://github.com/praveendandu02/simple-nodeJS-application'
    }

    stage('Build and test') {
        // Install dependencies and run tests
        sh 'npm install'
        sh 'npm test'
    }

    stage('Build Docker image') {
        // Build the Docker image and tag it with the commit hash
        sh "docker build -t my-app:${env.GIT_COMMIT} ."
    }

    stage('Push Docker image') {
        // Push the Docker image to a container registry
        withCredentials([usernamePassword(credentialsId: 'my-registry-creds',
                                          usernameVariable: 'DOCKER_USERNAME',
                                          passwordVariable: 'DOCKER_PASSWORD')]) {
            sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
            sh "docker push my-app:${env.GIT_COMMIT}"
        }
    }

    stage('Deploy to Kubernetes') {
        // Set up the Kubernetes configuration
        withKubeConfig([credentialsId: 'my-kubeconfig',
                        serverUrl: 'https://localhost:8443']) {
            // Apply the Kubernetes deployment and service YAML files
            sh 'kubectl apply -f my-deployment.yaml -f my-service.yaml'
        }
    }

    stage('Verify deployment') {
        // Wait for the service to become available
        sh 'kubectl rollout status deployment/my-app'
        sh 'kubectl get service/my-app'
    }
}
