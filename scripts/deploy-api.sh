#!/bin/bash

# Configuration
STACK_NAME="chatgenius-websocket-api"
ENVIRONMENT="production"
EC2_DNS="34.227.161.29"
REGION="us-east-1"

echo "Deploying WebSocket API Gateway..."
aws cloudformation deploy \
    --template-file infrastructure/websocket-api.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        Environment=$ENVIRONMENT \
        EC2InstanceDNS=$EC2_DNS \
    --capabilities CAPABILITY_IAM \
    --region $REGION

echo "Getting WebSocket API URL..."
API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebSocketApiUrl`].OutputValue' \
    --output text \
    --region $REGION)

echo "WebSocket API URL: $API_URL" 