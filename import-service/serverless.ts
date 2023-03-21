import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  useDotenv: true,
  provider: {
    name: "aws",
    deploymentMethod: "direct",
    runtime: "nodejs14.x",
    region: "us-east-1",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      REGION: "${self:provider.region}",
      BUCKET_NAME: "product-file",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: [
          `arn:aws:s3:::${process.env.BUCKET_NAME}`,
          `arn:aws:s3:::${process.env.BUCKET_NAME}/*`,
        ],
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Description: "Import service stack for My Shop app",
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
