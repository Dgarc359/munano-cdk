import { StackContext, Api, Function } from "@serverless-stack/resources";
import { AccountRootPrincipal, Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function MyStack({ stack, app }: StackContext) {
  const rootPrincipal = new AccountRootPrincipal();
  const lambdaServicePrincipal = new ServicePrincipal(
    "lambda.amazonaws.com"
  );
  const lambdaServiceAssumedRole = new Role(
    stack,
    app.logicalPrefixedName('lambda-role'),
    {
      assumedBy: lambdaServicePrincipal,
      description: `Assume role for ${app.name} lambda service`
    }
  );

  const kmsPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "kms:Decrypt",
      "kms:Encrypt",
    ],
    resources: ["*"],
    // conditions: [
    //   {
    //     "StringLike": {
    //       "kms:RequestAlias": "alias/aws/ssm"
    //     }
    //   }
    // ]
  });

  kmsPolicy.addCondition("StringLike", { "kms:RequestAlias": "alias/aws/ssm"});

  lambdaServiceAssumedRole.addToPolicy(kmsPolicy);

  lambdaServiceAssumedRole.addToPolicy(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "ssm:GetParameters",
      "ssm:GetParameter",
      "ssm:GetParameterByPath"
    ],
    resources: ["*"]
  }));

  lambdaServiceAssumedRole.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
  );

  const randP = new Function(
    stack,
    app.logicalPrefixedName('rand-p'),
    {
      handler: 'functions/index.handler',
      role: lambdaServiceAssumedRole
    }
  )
}
