import * as cdk      from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3       from 'aws-cdk-lib/aws-s3';
import * as sns      from 'aws-cdk-lib/aws-sns';
import * as lambda   from 'aws-cdk-lib/aws-lambda';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class AwsServerlessIacStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1️⃣ S3 bucket
    const bucket = new s3.Bucket(this, 'MyObjectsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2️⃣ SNS topic
    const topic = new sns.Topic(this, 'MyNotificationTopic');

    // 3️⃣ Lambda function
    const fn = new lambda.Function(this, 'ListAndNotifyHandler', {
      runtime:     lambda.Runtime.NODEJS_18_X,
      handler:     'index.handler',
      code:        lambda.Code.fromAsset('../lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TOPIC_ARN:   topic.topicArn,
      },
      timeout:     cdk.Duration.seconds(30),
    });

    // 4️⃣ Permissions
    bucket.grantRead(fn);
    topic.grantPublish(fn);

    // 5️⃣ Deploy local files into S3
    new s3deploy.BucketDeployment(this, 'DeployLocalFiles', {
      sources:           [ s3deploy.Source.asset('../local-files') ],
      destinationBucket: bucket,
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'TopicArn',  { value: topic.topicArn   });
  }
}
