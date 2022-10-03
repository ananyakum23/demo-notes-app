import { Bucket, Table } from "@serverless-stack/resources";
import { Template } from "aws-cdk-lib/assertions";
import { App, getStack } from "@serverless-stack/resources";
import { StorageStack } from "../StorageStack";
import { test } from "vitest";

export function StorageStack({ stack, app }) {
  // Create the DynamoDB table
  const table = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
  });

  // Create an S3 bucket
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  return {
    table,
    bucket,
  };
}

test("Test StorageStack", () => {
  const app = new App();
  // WHEN
  app.stack(StorageStack);
  // THEN
  const template = Template.fromStack(getStack(StorageStack));
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
  });
});