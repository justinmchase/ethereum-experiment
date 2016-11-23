import nconf from 'nconf'

export var config = nconf

nconf
  .argv()
  .env('_')
  .defaults({
    aws: {
      dynamo: {
        endpoint: 'http://localhost:8000',
        accessKeyId: 'AKID',
        secretAccessKey: 'SECRET',
        apiVersion: '2012-08-10',
        region: 'us-east-1'
      }
    }
  })
