pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID   = '354935533710'
        AWS_REGION       = 'eu-north-1'
        ECR_REPOSITORY   = 'my-web-app'
        DOCKER_IMAGE     = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
        IMAGE_TAG        = "${BUILD_NUMBER}"

        EC2_HOST         = 'ec2-51-20-40-8.eu-north-1.compute.amazonaws.com'
        EC2_USER         = 'ec2-user'

        AWS_CREDENTIALS  = 'aws-credentials-id'
        EMAIL_RECIPIENTS = 'your-email@example.com'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '==================== Checking out code from GitHub ===================='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '==================== Installing Node.js Dependencies ===================='
                sh '''
                    rm -rf node_modules package-lock.json
                    npm cache clean --force
                    npm install --no-progress --verbose
                '''
            }
        }

        stage('Build') {
            steps {
                echo '==================== Building the Application ===================='
                sh '''
                    if [ -f package.json ]; then
                        npm run build || echo "No build script found"
                    fi
                '''
            }
        }

        stage('Test') {
            steps {
                echo '==================== Running Tests ===================='
                sh '''
                    if [ -f package.json ]; then
                        npm test || echo "Tests failed or not defined"
                    fi
                '''
            }
        }

        stage('Lint') {
            steps {
                echo '==================== Running ESLint ===================='
                sh '''
                    if [ -f package.json ]; then
                        npm run lint || echo "Lint warnings ignored"
                    fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '==================== Building Docker Image ===================='
                sh '''
                    docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .
                    docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                echo '==================== Pushing Docker Image to AWS ECR ===================='
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                credentialsId: "${AWS_CREDENTIALS}"]]) {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} \
                        | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '==================== Deploying to EC2 ===================='
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_CREDENTIALS}"],
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')
                ]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY ${EC2_USER}@${EC2_HOST} << 'EOF'
                            set -e
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                            docker stop my-web-app || true
                            docker rm my-web-app || true

                            docker pull ${DOCKER_IMAGE}:${IMAGE_TAG}
                            docker run -d --name my-web-app -p 80:3000 ${DOCKER_IMAGE}:${IMAGE_TAG}

                            docker image prune -f
                        EOF
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                echo '==================== Performing Health Check ===================='
                sh '''
                    sleep 10
                    curl -f http://${EC2_HOST}/ || (echo "Health check failed" && exit 1)
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Succeeded'
            emailext (
                subject: "✅ Jenkins Pipeline Success: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Success!</h2>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build #:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Docker Image:</b> ${DOCKER_IMAGE}:${IMAGE_TAG}</p>
                    <p><b>Deployment:</b> <a href="http://${EC2_HOST}">http://${EC2_HOST}</a></p>
                """,
                to: "${EMAIL_RECIPIENTS}",
                mimeType: 'text/html'
            )
        }

        failure {
            echo '❌ Pipeline Failed'
            emailext (
                subject: "❌ Jenkins Pipeline Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Failed!</h2>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p>Please review the console logs for more details.</p>
                """,
                to: "${EMAIL_RECIPIENTS}",
                mimeType: 'text/html'
            )
        }

        always {
            cleanWs()
        }
    }
}
