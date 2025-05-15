// AWS Configuration for Cognito
// @ts-nocheck
export const awsConfig = {
  Auth: {
    // Replace these with your actual AWS Cognito configuration
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
};