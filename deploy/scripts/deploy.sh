#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | xargs)
fi

# Check required environment variables
if [ -z "$ECR_REPO_URI" ]; then
  echo "ECR_REPO_URI is not set"
  exit 1
fi

if [ -z "$AWS_REGION" ]; then
  export AWS_REGION="us-east-1"
fi

echo "Starting deployment process..."

# Build and push Docker image
echo "Building and pushing Docker image..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI
docker build -t chatgenius-gm .
docker tag chatgenius-gm:latest $ECR_REPO_URI:latest
docker push $ECR_REPO_URI:latest

# Update ECS service
echo "Updating ECS service..."
aws ecs update-service \
    --cluster chatgenius-gm-cluster \
    --service chatgenius-gm-service \
    --force-new-deployment \
    --region $AWS_REGION

echo "Deployment completed successfully!" 