import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class CdkStack extends cdk.Stack {
  constructor(_scope: Construct, _id: string, _props?: cdk.StackProps) {
    super(_scope, _id, _props);

    // S3 bucket
    const bucket = new s3.Bucket(this, "MyObjectsBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const topic = new sns.Topic(this, "MyNotificationTopic");
    topic.addSubscription(new subs.EmailSubscription("oriadika10@gmail.com"));

    const fn = new lambda.Function(this, "ListAndNotifyHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambda"),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TOPIC_ARN: topic.topicArn,
      },
      timeout: cdk.Duration.seconds(30),
    });

    bucket.grantRead(fn);
    topic.grantPublish(fn);

    new s3deploy.BucketDeployment(this, "DeployLocalFiles", {
      sources: [s3deploy.Source.asset("../local-files")],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
    });
    new cdk.CfnOutput(this, "TopicArn", {
      value: topic.topicArn,
    });
  }
}
