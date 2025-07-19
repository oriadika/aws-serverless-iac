const AWS = require('aws-sdk');
const { handler } = require('./index');

// Mock S3.listObjectsV2 and SNS.publish
jest.mock('aws-sdk', () => {
  const listObjectsMock = jest.fn().mockReturnValue({
    promise: () => Promise.resolve({ Contents: [{ Key: 'foo.txt' }] })
  });
  const publishMock = jest.fn().mockReturnValue({
    promise: () => Promise.resolve()
  });
  return {
    S3: jest.fn(() => ({ listObjectsV2: listObjectsMock })),
    SNS: jest.fn(() => ({ publish: publishMock })),
  };
});

describe('Lambda handler', () => {
  beforeAll(() => {
    process.env.BUCKET_NAME = 'dummy-bucket';
    process.env.TOPIC_ARN   = 'arn:aws:sns:us-east-1:123:topic';
  });

  it('returns 200 and message containing foo.txt', async () => {
    const response = await handler({});
    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.message).toMatch(/foo\.txt/);
  });
});
