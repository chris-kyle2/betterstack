// AWS Configuration for Cognito
export const awsConfig = {
  Auth: {
    // Replace these with your actual AWS Cognito configuration
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID || 'us-east-1_1Qfz8qLsw',
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID || '3o46972ns1ataqhvnf1jm19sdp',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
};