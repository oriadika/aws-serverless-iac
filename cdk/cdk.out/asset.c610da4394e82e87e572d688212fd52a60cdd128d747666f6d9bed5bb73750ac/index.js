const AWS = require('aws-sdk');
const s3  = new AWS.S3();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const bucket   = process.env.BUCKET_NAME;
  const topicArn = process.env.TOPIC_ARN;

  // List objects
  const { Contents = [] } = await s3.listObjectsV2({ Bucket: bucket }).promise();
  const keys = Contents.map(o => o.Key).join(', ') || '<empty>';

  // Publish to SNS
  const message = `Bucket "${bucket}" contains: ${keys}`;
  await sns.publish({ TopicArn: topicArn, Message: message, Subject: 'S3 Objects' }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
};
