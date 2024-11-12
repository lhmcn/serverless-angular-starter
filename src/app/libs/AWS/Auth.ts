import * as Auth from "@aws-amplify/auth";
import { CurrentUser } from "./models/CurrentUser";
import { Result } from "./models/Result";
import { Observable, Subject } from "rxjs";

interface AWSSignInResult extends Result {
	newPasswordRequired: boolean;
}

/**
 * Logs in a user.
 * @param username The unique identifier of a user
 * @param password Current password
 * @param newPassword If a user is required to change password, then a new password must be provided
 */
export const awsSignIn = (
	username: string,
	password: string,
	newPassword?: string | null,
): Observable<AWSSignInResult> => {
	const result: AWSSignInResult = {
		success: false,
		newPasswordRequired: false,
	};

	const resultSubject = new Subject<AWSSignInResult>();

	Auth.signIn({ username, password })
		.then((output) => {
			if (
				output.nextStep.signInStep ===
					"CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" &&
				newPassword
			) {
				return Auth.confirmSignIn({ challengeResponse: newPassword });
			}

			return output;
		})
		.then((output) => {
			if (
				output.nextStep.signInStep ===
				"CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
			) {
				result.newPasswordRequired = true;
				result.message = "Please set a new password";
			} else {
				result.success = output.isSignedIn;
			}

			resultSubject.next(result);
		})
		.catch((err) => {
			console.log(err);
			result.code = err.code;
			result.message = err.message;

			resultSubject.next(result);
		});

	return resultSubject.asObservable();
};

/**
 * Logs the current user out.
 */
export const awsSignOut = (): Observable<void> => {
	const resultSubject = new Subject<void>();

	Auth.signOut()
		.then(() => {
			resultSubject.next();
		})
		.catch((err) => {
			console.log(err);

			resultSubject.next();
		});

	return resultSubject.asObservable();
};

export const defaultCurrentUser: CurrentUser = {
	loggedIn: false,
};

/**
 * Gets the information of current user.
 * @return Returns an object with success info and username, email, identityId.
 */
export const awsCurrentUser = (): Observable<CurrentUser> => {
	const resultSubject = new Subject<CurrentUser>();

	Auth.fetchAuthSession()
		.then((currentAuthUser) => {
			resultSubject.next(mapToCurrentUser(currentAuthUser));
		})
		.catch((err) => {
			console.log(err);
		});

	return resultSubject.asObservable();
};

/**
 * Change the password of current user.
 * @param oldPassword Old password
 * @param newPassword New Password
 */
export const awsChangePassword = (
	oldPassword: string,
	newPassword: string,
): Observable<Result> => {
	const result: Result = {
		success: false,
	};

	const resultSubject = new Subject<Result>();

	Auth.getCurrentUser()
		.then((user) => Auth.updatePassword({ oldPassword, newPassword }))
		.then(() => {
			result.success = true;

			resultSubject.next(result);
		})
		.catch((err) => {
			result.code = err.code;
			result.message = err.message;

			resultSubject.next(result);
		});

	return resultSubject.asObservable();
};

const mapToCurrentUser = (cognitoUser: any): CurrentUser => {
	const user = { ...defaultCurrentUser };

	// Stop if the user is not logged in
	if (!cognitoUser?.userSub) {
		return user;
	}

	const userAttributes = cognitoUser.tokens.idToken.payload;
	// Populate result with information from Cognito
	user.sub = userAttributes.sub;
	user.username = userAttributes["cognito:username"];
	user.name = userAttributes.name;
	user.email = userAttributes.email;
	user.email_verified = userAttributes.email_verified;
	user.userGroups = userAttributes["cognito:groups"];
	user.loggedIn = true;

	return user;
};
