#!/bin/bash

# Navigate to the handler directory
cd websocket-handler

# Install dependencies
npm install

# Create a ZIP file
zip -r ../function.zip .

# Navigate back
cd ..

# Create or update the Lambda function
if aws lambda get-function --function-name chatgenius-websocket-handler 2>/dev/null; then
  # Update existing function
  aws lambda update-function-code \
    --function-name chatgenius-websocket-handler \
    --zip-file fileb://function.zip
else
  # Create new function
  aws lambda create-function \
    --function-name chatgenius-websocket-handler \
    --runtime nodejs18.x \
    --handler index.handler \
    --role arn:aws:iam::474668398195:role/lambda-role \
    --zip-file fileb://function.zip
fi

# Clean up
rm function.zip 