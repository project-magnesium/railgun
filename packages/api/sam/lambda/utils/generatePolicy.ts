import { PolicyDocument, AuthResponse, Statement, APIGatewayAuthorizerResultContext } from 'aws-lambda';

// Help function to generate an IAM policy
const generatePolicy = (
    principalId: string,
    effect: string,
    resource: string,
    context: APIGatewayAuthorizerResultContext | null = null,
) => {
    if (!effect || !resource) return;

    const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: [],
    };

    const statementOne: Statement = {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
    };
    policyDocument.Statement[0] = statementOne;

    const authResponse: AuthResponse = {
        principalId,
        policyDocument,
        context,
    };
    return authResponse;
};

export default generatePolicy;
