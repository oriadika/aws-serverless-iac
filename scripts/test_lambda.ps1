# test_lambda.ps1
param(
  [string]$StackName = "CdkStack",
  [string]$Region    = "us-east-1"
)

# 1) Get the Lambda function name from CloudFormation outputs
$fnArn = (aws cloudformation describe-stacks `
  --stack-name $StackName `
  --region $Region `
  --query "Stacks[0].Outputs[?starts_with(OutputKey,'ListAndNotifyHandler')].OutputValue" `
  --output text)
$fnName = $fnArn.Split(":")[-1]

# 2) Invoke the function with event.json
aws lambda invoke `
  --function-name $fnName `
  --region $Region `
  --payload (Get-Content ../scripts/event.json -Raw) `
  response.json | Out-Null

Write-Host "Response:"
Get-Content response.json