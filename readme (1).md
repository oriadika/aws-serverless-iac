# AWS Serverless IaC Demo

**Author:** Ori Adika – 209200559 **GitHub:** [https://github.com/oriadika/aws-serverless-iac](https://github.com/oriadika/aws-serverless-iac)

---

## 📦 Project Overview

This repository contains a production‑grade, fully automated serverless application on AWS, deployed and managed via Infrastructure as Code (IaC) with the AWS CDK (TypeScript). On each deployment, the app will:

1. **Upload** all files from `local-files/` to an S3 bucket.
2. **Execute** a Lambda function that lists *all* objects in that bucket.
3. **Publish** the object list to an SNS topic, sending an email notification.
4. Support **manual invocation** of the Lambda for ad‑hoc testing.

---

## 🔧 Prerequisites

- AWS account with an IAM user (programmatic access).
- AWS CLI v2 installed and configured (`aws configure`).
- Node.js ≥ 14.x & npm.
- Python ≥ 3.9.
- AWS CDK CLI (`npm install -g aws-cdk`).
- Git & a GitHub account.

> **Region:** This guide assumes **us‑east‑1**. If you use a different region, adjust commands accordingly.

---

## 📁 Repository Structure

```
aws-serverless-iac/
├── cdk/               # CDK app (TypeScript)
│   ├── bin/           # CDK entrypoint script
│   ├── lib/           # Stack definitions
│   ├── tsconfig.json  # TypeScript config
│   └── package.json   # CDK dependencies & build scripts
├── lambda/            # Lambda function code
│   ├── index.js       # Handler (Node.js)
│   ├── package.json   # Lambda dependencies
│   └── package-lock.json
├── local-files/       # Sample files to upload to S3
│   └── hello.txt      # Example file
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions CI/CD pipeline
```

---

## 🚀 Setup & Deployment

Follow these steps to deploy the entire stack:

1. **Clone the repository**

   ```bash
   git clone https://github.com/oriadika/aws-serverless-iac.git
   cd aws-serverless-iac
   ```

2. **Install Lambda dependencies**

   ```bash
   cd lambda
   npm install
   ```

3. **Install CDK app dependencies**

   ```bash
   cd ../cdk
   npm install
   ```

4. **Compile the CDK TypeScript code**

   ```bash
   npm run build
   ```

5. **Bootstrap your AWS environment**

   ```bash
   cdk bootstrap \  
     aws://$(aws sts get-caller-identity --query Account --output text)/us-east-1
   ```

6. **Deploy the stack**

   ```bash
   cdk deploy --require-approval never
   ```

   - An SNS **Subscription Confirmation** email will arrive—in your inbox, **click the link** to activate notifications.

---

## 🔍 Manual Lambda Test

Execute an on‑demand test of your Lambda function:

1. **Retrieve the function name**

   ```bash
   FUNCTION_NAME=$(aws lambda list-functions \  
     --region us-east-1 \  
     --query "Functions[?starts_with(FunctionName,'CdkStack-ListAndNotifyHandler')].FunctionName" \  
     --output text)
   echo $FUNCTION_NAME
   ```

2. **Invoke the function**

   ```bash
   aws lambda invoke \  
     --region us-east-1 \  
     --function-name $FUNCTION_NAME \  
     --payload '{}' \  
     response.json
   ```

3. **View the invocation result**

   ```bash
   cat response.json
   # → {"message":"Bucket \"<YourBucketName>\" contains: hello.txt"}
   ```

4. **Verify email notification**

   - An SNS email with the same message should arrive in your inbox.

---

## 🤖 CI/CD with GitHub Actions

Automate deployments via GitHub Actions:

1. **Workflow file location**: `.github/workflows/deploy.yml`
2. **Configure Secrets** in GitHub Settings → Secrets → Actions:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `us-east-1`)
3. **Run the workflow**:
   - Go to the **Actions** tab → **CDK Deploy** → **Run workflow**

The pipeline will:

- Checkout code
- Install dependencies
- Bootstrap (if required)
- Deploy the CDK stack

---

## 🧹 Tear‑down (Cleanup)

Remove all AWS resources to avoid charges:

```bash
cd aws-serverless-iac/cdk
cdk destroy --force
```

---

## 🛠️ Tools & Frameworks

- **AWS CDK** (v2, TypeScript)
- **AWS CLI** (v2)
- **Node.js** & **npm**
- **GitHub Actions**

---

*Ori Adika – 209200559*

