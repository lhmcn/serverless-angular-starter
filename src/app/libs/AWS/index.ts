import { Amplify } from "aws-amplify";
import config from "./awsConfig";
import { API_NAME } from "./API";

Amplify.configure({
	Auth: {
		Cognito: {
			identityPoolId: config.cognito.IDENTITY_POOL_ID,
			allowGuestAccess: false,
			userPoolClientId: config.cognito.APP_CLIENT_ID,
			userPoolId: config.cognito.USER_POOL_ID,
		},
	},
	Storage: {
		S3: {
			region: config.region,
			bucket: config.s3.BUCKET,
		},
	},
	API: {
		REST: {
			[API_NAME]: {
				endpoint: config.apiGateway.URL,
				region: config.region,
			},
		},
	},
});

export * from "./Auth";
export * from "./API";
export * from "./Storage";
