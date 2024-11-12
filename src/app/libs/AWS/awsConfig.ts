const awsConfig = {
	region: "us-east-1",
	s3: {
		BUCKET: "your-s3-attachment-bucket",
	},
	apiGateway: {
		URL: "your-api-root-url",
	},
	cognito: {
		APP_CLIENT_ID: "your-cognito-app-client-id",
		USER_POOL_ID: "your-cognito-user-pool-id",
		IDENTITY_POOL_ID: "your-cognito-id-pool-id",
	},
};

export default awsConfig;
