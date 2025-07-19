# AWS Serverless Infrastructure as Code

**Author:** Ori Adika (209200559)\
**Repository:** [https://github.com/oriadika/aws-serverless-iac](https://github.com/oriadika/aws-serverless-iac)

---

## 1. Introduction

This project demonstrates a fully automated serverless application on AWS, provisioned and managed through Infrastructure as Code (IaC) with the AWS Cloud Development Kit (CDK) in TypeScript. Each deployment performs the following:

- Uploads all files from the `local-files/` directory to an Amazon S3 bucket.
- Executes an AWS Lambda function that lists all objects in the bucket.
- Publishes the object list to an Amazon SNS topic, sending an email notification.
- Supports manual invocation of the Lambda function for testing.

This setup is ideal for production environments, with minimal manual configuration.

---

## 2. Prerequisites

Before you begin, ensure you have the following installed and configured:

- **AWS Account** with an IAM user (programmatic access)
- **AWS CLI v2** (configured via `aws configure`)
- **Node.js** (v14 or later) and **npm**
- **Python** (v3.9 or later)
- **AWS CDK CLI** (`npm install -g aws-cdk`)
- **Git** and a **GitHub** account

> **Note:** This guide assumes the AWS region `us-east-1`. For a different region, append `--region <your-region>` to AWS CLI commands.

---

## 3. Repository Layout

```text
aws-serverless-iac/
├── cdk/               # CDK application (TypeScript)
│   ├── bin/           # CDK entrypoint
│   ├── lib/           # Stack definitions
│   ├── tsconfig.json  # TypeScript configuration
│   └── package.json   # Dependencies and build scripts
├── lambda/            # Lambda function code (Node.js)
│   ├── index.js       # Handler implementation
│   ├── package.json   # Lambda dependencies
│   └── package-lock.json
├── local-files/       # Files uploaded to S3 on deployment
│   └── hello.txt      # Sample file
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions workflow for CI/CD
```

---

## 4. Deployment Steps

Follow these steps to deploy the application:

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

3. **Install CDK dependencies**

   ```bash
   cd ../cdk
   npm install
   ```

4. **Compile the CDK application**

   ```bash
   npm run build
   ```

5. **Bootstrap the AWS environment**

   ```bash
   cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/us-east-1
   ```

6. **Deploy the CDK stack**

   ```bash
   cdk deploy --require-approval never
   ```

   After deployment, confirm the SNS subscription in your email to enable notifications.

---

## 5. Manual Testing

To verify the Lambda function independently:

1. **Obtain the function name**

   ```bash
   aws lambda list-functions \
     --region us-east-1 \
     --query "Functions[?starts_with(FunctionName, 'CdkStack-ListAndNotifyHandler')].FunctionName" \
     --output text
   ```

2. **Invoke the Lambda**

   ```bash
   aws lambda invoke \
     --region us-east-1 \
     --function-name <FunctionName> \
     --payload '{}' \
     response.json
   ```

3. **Examine the response**

   ```bash
   cat response.json
   # Expected format:
   # {"message":"Bucket \"<BucketName>\" contains: hello.txt"}
   ```

4. **Check email**\
   Verify receipt of the SNS notification with the same message.

---

## 6. Continuous Integration / Continuous Deployment

This repository uses GitHub Actions to automate deployments.

1. **Workflow file**: `.github/workflows/deploy.yml`

2. **Configure repository secrets** (Settings → Secrets → Actions):

   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `us-east-1`)

3. **Trigger the workflow**:

   - Navigate to the Actions tab in GitHub
   - Select **CDK Deploy** → **Run workflow**

The workflow will checkout the code, install dependencies, bootstrap, and deploy the stack.

---

## 7. Cleanup

To remove all resources and prevent ongoing charges:

```bash
cd aws-serverless-iac/cdk
cdk destroy --force
```

---

## 8. Technologies Used

- AWS CDK (v2) with TypeScript
- AWS CLI (v2)
- Node.js & npm
- GitHub Actions

---

*Ori Adika – 209200559*

