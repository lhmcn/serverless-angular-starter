export interface CurrentUser {
	loggedIn: boolean;
	username?: string;
	name?: string;
	email?: string;
	email_verified?: boolean;
	sub?: string;
	userGroups?: string[];
}
