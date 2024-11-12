import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { BehaviorSubject, tap } from "rxjs";
import { awsCurrentUser, awsSignIn, awsSignOut } from "../libs/AWS";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private currentUser = new BehaviorSubject<User | null>(null);

	public currentUser$ = this.currentUser.asObservable();

	constructor() {
		awsCurrentUser().subscribe((user) => this.currentUser.next(user));
	}

	public login(
		username: string,
		password: string,
		newPassword: string | null,
	) {
		return awsSignIn(username, password, newPassword).pipe(
			tap((result) => {
				if (result.success) {
					awsCurrentUser().subscribe((currentUser) => {
						this.currentUser.next(currentUser);
					});
				}
			}),
		);
	}

	public logout() {
		return awsSignOut().pipe(tap(() => this.currentUser.next(null)));
	}
}
