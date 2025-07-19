# AWS Serverless IaC Demo

## Project Overview
A fully‑automated serverless app that:
- Uploads local sample files to S3 on deploy  
- Lists S3 objects in a Lambda  
- Sends an SNS email notification on each run  
- Can be manually triggered for testing

## Prerequisites
- AWS account & IAM user with programmatic access  
- Node.js ≥14, npm, Python ≥3.9, AWS CLI, AWS CDK

## Setup & Deployment
1. `git clone … && cd aws-serverless-iac/cdk`  
2. `npm install`  
3. `cdk bootstrap aws://YOUR_ACCOUNT/YOUR_REGION`  
4. `cdk deploy --require-approval never`

## Manual Lambda Test
1. `aws lambda invoke --function-name ListAndNotifyHandler --payload '{}' response.json`  
2. `cat response.json`  
(Or use the `scripts/test_lambda.sh` helper.)

## Tools & Frameworks
- AWS CDK (TypeScript)  
- AWS CLI  
- GitHub Actions for CI/CD  
