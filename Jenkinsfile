def notifySlack(String buildStatus = 'STARTED') {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#CACFD2'
    } else if (buildStatus == 'SUCCESS') {
        color = '#196F3D'
    } else if (buildStatus == 'FAILURE') {
        color = '#922B21'
    } else {
        color = '#F4D03F'
    }

    def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER}:\n${env.BUILD_URL}"

    slackSend(color: color, message: msg)
}

node {
    try {
        notifySlack("STARTED")

        def imageName = "nxt-user-app-develop-i"
        def containerName = "nxt-user-app-develop-c"
        def tag = "1.0"

        stage('SCM Checkout') {
            git branch: 'develop', credentialsId: '22f48ea6-da0e-4196-8df4-393c3bea75e1', url: 'http://10.5.0.5:3000/next/nxt-user-app.git'
        }
        stage('Build') {
            sh "npm install"
        }
        stage('Clean old image and container') {
            sh "docker stop ${containerName} || true"
            sh "docker rm -f ${containerName} && echo 'container ${containerName} removed' || echo 'container ${containerName} does not exist'"
            sh "docker rmi -f ${imageName}:${tag} && echo 'image ${imageName}:${tag} removed' || echo 'image ${imageName}:${tag} does not exist'"
        }
        stage('Build image') {
            sh "docker build -t ${imageName}:${tag} -f Dockerfile . --build-arg ENV=dev"
        }
        stage('Run new container') {
            sh "docker run -d --name ${containerName} -p 3004:80 -e HOST_ENV=dev ${imageName}:${tag}"
        }
    } catch (e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        notifySlack(currentBuild.result)
    }
}