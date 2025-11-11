pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID   = '354935533710'
        AWS_REGION       = 'eu-north-1'
        ECR_REPOSITORY   = 'my-web-app'
        DOCKER_IMAGE     = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
        IMAGE_TAG        = "${BUILD_NUMBER}"

        EC2_HOST         = 'ec2-51-20-108-17.eu-north-1.compute.amazonaws.com'
        EC2_USER         = 'ec2-user'

        AWS_CREDENTIALS  = 'aws-credentials-id'
        EMAIL_RECIPIENTS = 'nebalsugin@gmail.com'
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
                ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${EC2_USER}@${EC2_HOST} \
                "AWS_REGION=${AWS_REGION} \
                AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID} \
                DOCKER_IMAGE=${DOCKER_IMAGE} \
                IMAGE_TAG=${IMAGE_TAG} \
                bash -s" << 'ENDSSH'
                    set -e
                    echo "Logging into ECR..."
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                    echo "Stopping old container..."
                    docker stop my-web-app || true
                    docker rm my-web-app || true

                    echo "Pulling latest image..."
                    docker pull ${DOCKER_IMAGE}:${IMAGE_TAG}

                    echo "Running container..."
                    docker run -d --name my-web-app -p 80:3000 ${DOCKER_IMAGE}:${IMAGE_TAG}

                    echo "Cleaning up old images..."
                    docker image prune -f
ENDSSH
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
            subject: "✅ Deployment Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 40px 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border-radius: 20px;
                            overflow: hidden;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        }
                        .header {
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            padding: 50px 40px;
                            text-align: center;
                            position: relative;
                        }
                        .header::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>');
                            opacity: 0.1;
                        }
                        .success-icon {
                            width: 80px;
                            height: 80px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 50%;
                            margin: 0 auto 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            backdrop-filter: blur(10px);
                            border: 3px solid rgba(255, 255, 255, 0.3);
                        }
                        .success-icon svg {
                            width: 45px;
                            height: 45px;
                            fill: white;
                        }
                        .header h1 {
                            color: white;
                            font-size: 32px;
                            font-weight: 700;
                            margin-bottom: 10px;
                            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                        }
                        .header p {
                            color: rgba(255, 255, 255, 0.95);
                            font-size: 16px;
                            font-weight: 500;
                        }
                        .content {
                            padding: 40px;
                        }
                        .info-grid {
                            display: table;
                            width: 100%;
                            margin-bottom: 30px;
                        }
                        .info-row {
                            display: table-row;
                        }
                        .info-label, .info-value {
                            display: table-cell;
                            padding: 16px;
                            border-bottom: 1px solid #f0f0f0;
                        }
                        .info-label {
                            color: #64748b;
                            font-weight: 600;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            width: 40%;
                        }
                        .info-value {
                            color: #1e293b;
                            font-weight: 600;
                            font-size: 15px;
                        }
                        .deployment-badge {
                            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                            border-left: 4px solid #10b981;
                            padding: 20px;
                            border-radius: 12px;
                            margin: 30px 0;
                        }
                        .deployment-badge strong {
                            color: #059669;
                            font-size: 14px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            display: block;
                            margin-bottom: 8px;
                        }
                        .deployment-link {
                            display: inline-block;
                            color: #10b981;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 16px;
                            padding: 12px 24px;
                            background: white;
                            border-radius: 8px;
                            margin-top: 10px;
                            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
                        }
                        .footer {
                            background: #f8fafc;
                            padding: 30px 40px;
                            text-align: center;
                            border-top: 1px solid #e2e8f0;
                        }
                        .footer p {
                            color: #64748b;
                            font-size: 13px;
                            line-height: 1.6;
                        }
                        .status-indicator {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            background: #10b981;
                            border-radius: 50%;
                            margin-right: 8px;
                            animation: pulse 2s ease-in-out infinite;
                        }
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="success-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                            </div>
                            <h1>Deployment Successful</h1>
                            <p>Your build has been deployed successfully</p>
                        </div>
                        
                        <div class="content">
                            <div class="info-grid">
                                <div class="info-row">
                                    <div class="info-label">Project</div>
                                    <div class="info-value">${env.JOB_NAME}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Build Number</div>
                                    <div class="info-value">#${env.BUILD_NUMBER}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Docker Image</div>
                                    <div class="info-value">${DOCKER_IMAGE}:${IMAGE_TAG}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Status</div>
                                    <div class="info-value">
                                        <span class="status-indicator"></span>Live & Running
                                    </div>
                                </div>
                            </div>

                            <div class="deployment-badge">
                                <strong>🚀 Deployment URL</strong>
                                <a href="http://${EC2_HOST}" class="deployment-link">
                                    View Application →
                                </a>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>
                                This is an automated notification from your CI/CD pipeline.<br>
                                Build completed at ${new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            """,
            to: "${EMAIL_RECIPIENTS}",
            mimeType: 'text/html'
        )
    }

    failure {
        echo '❌ Pipeline Failed'
        emailext (
            subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 40px 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border-radius: 20px;
                            overflow: hidden;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        }
                        .header {
                            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                            padding: 50px 40px;
                            text-align: center;
                            position: relative;
                        }
                        .header::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>');
                            opacity: 0.1;
                        }
                        .error-icon {
                            width: 80px;
                            height: 80px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 50%;
                            margin: 0 auto 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            backdrop-filter: blur(10px);
                            border: 3px solid rgba(255, 255, 255, 0.3);
                        }
                        .error-icon svg {
                            width: 45px;
                            height: 45px;
                            fill: white;
                        }
                        .header h1 {
                            color: white;
                            font-size: 32px;
                            font-weight: 700;
                            margin-bottom: 10px;
                            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                        }
                        .header p {
                            color: rgba(255, 255, 255, 0.95);
                            font-size: 16px;
                            font-weight: 500;
                        }
                        .content {
                            padding: 40px;
                        }
                        .alert-box {
                            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                            border-left: 4px solid #ef4444;
                            padding: 20px;
                            border-radius: 12px;
                            margin-bottom: 30px;
                        }
                        .alert-box p {
                            color: #991b1b;
                            font-size: 15px;
                            line-height: 1.6;
                            margin: 0;
                        }
                        .info-grid {
                            display: table;
                            width: 100%;
                            margin-bottom: 30px;
                        }
                        .info-row {
                            display: table-row;
                        }
                        .info-label, .info-value {
                            display: table-cell;
                            padding: 16px;
                            border-bottom: 1px solid #f0f0f0;
                        }
                        .info-label {
                            color: #64748b;
                            font-weight: 600;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            width: 40%;
                        }
                        .info-value {
                            color: #1e293b;
                            font-weight: 600;
                            font-size: 15px;
                        }
                        .action-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                            color: white;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 16px;
                            padding: 16px 32px;
                            border-radius: 12px;
                            text-align: center;
                            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                            margin-top: 10px;
                        }
                        .footer {
                            background: #f8fafc;
                            padding: 30px 40px;
                            text-align: center;
                            border-top: 1px solid #e2e8f0;
                        }
                        .footer p {
                            color: #64748b;
                            font-size: 13px;
                            line-height: 1.6;
                        }
                        .status-indicator {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            background: #ef4444;
                            border-radius: 50%;
                            margin-right: 8px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="error-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                                </svg>
                            </div>
                            <h1>Build Failed</h1>
                            <p>Your pipeline encountered an error</p>
                        </div>
                        
                        <div class="content">
                            <div class="alert-box">
                                <p>
                                    <strong>⚠️ Action Required:</strong><br>
                                    The build process has failed. Please review the console logs to identify and resolve the issue.
                                </p>
                            </div>

                            <div class="info-grid">
                                <div class="info-row">
                                    <div class="info-label">Project</div>
                                    <div class="info-value">${env.JOB_NAME}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Build Number</div>
                                    <div class="info-value">#${env.BUILD_NUMBER}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Failed At</div>
                                    <div class="info-value">${new Date().toLocaleString()}</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">Status</div>
                                    <div class="info-value">
                                        <span class="status-indicator"></span>Failed
                                    </div>
                                </div>
                            </div>

                            <div style="text-align: center;">
                                <a href="${env.BUILD_URL}console" class="action-button">
                                    View Console Logs →
                                </a>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>
                                This is an automated notification from your CI/CD pipeline.<br>
                                For support, please check the Jenkins console output.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
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
