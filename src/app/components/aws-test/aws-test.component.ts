import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import * as AWS from "../../libs/AWS";
import { v4 as uuid } from "uuid";
import { CurrentUser } from "../../libs/AWS/models/CurrentUser";
import { UserService } from "../../services/user.service";

interface PayloadControlListItem {
	id: string;
	keyControl: FormControl<string | null>;
	valueControl: FormControl<string | null>;
}

@Component({
	selector: "app-aws-test",
	templateUrl: "./aws-test.component.html",
	styleUrl: "./aws-test.component.scss",
})
export class AwsTestComponent implements OnInit {
	protected apiMethods = [
		["get", "awsGet"],
		["post", "awsPost"],
		["put", "awsPut"],
		["del", "awsDel"],
		["patch", "awsPatch"],
		["head", "awsHead"],
	];

	protected usernameFormControl = new FormControl<string>("");
	protected passwordFormControl = new FormControl<string>("");
	protected newPasswordFormControl = new FormControl<string>("");
	protected apiMethodFormControl = new FormControl<string>(
		this.apiMethods[0][1],
	);
	protected apiEndpointFormControl = new FormControl<string>("");
	protected apiPayloadControls: PayloadControlListItem[] = [];

	protected currentUser: CurrentUser | null = null;
	protected newPasswordRequired = false;

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.userService.currentUser$.subscribe((user) => {
			this.currentUser = user;
		});
	}

	protected onLogin = () => {
		const username = this.usernameFormControl.value;
		const password = this.passwordFormControl.value;
		const newPassword = this.newPasswordFormControl.value;

		if (
			username &&
			password &&
			(!this.newPasswordRequired || newPassword)
		) {
			this.userService
				.login(username, password, newPassword)
				.subscribe((result) => {
					this.newPasswordRequired = result.newPasswordRequired;
				});
		}
	};

	protected onLogout = () => {
		this.userService.logout().subscribe(() => {
			this.currentUser = null;
		});
	};

	protected onAddPayloadField = () => {
		this.apiPayloadControls.push({
			id: uuid(),
			keyControl: new FormControl<string>(""),
			valueControl: new FormControl<string>(""),
		});
	};

	protected onRemovePayloadField = (id: string) => {
		this.apiPayloadControls = this.apiPayloadControls.filter(
			(control) => control.id !== id,
		);
	};

	protected onSubmit = () => {
		const method = this.apiMethodFormControl.value;
		const endpoint = this.apiEndpointFormControl.value;
		const payload = this.getPayload();

		if (method && endpoint) {
			// @ts-ignore
			AWS[method](endpoint, payload).subscribe(console.log);
		}
	};

	private getPayload = () => {
		const payload: any = {};

		this.apiPayloadControls.forEach((item) => {
			if (item.keyControl.value) {
				payload[item.keyControl.value] = item.valueControl.value;
			}
		});

		return payload;
	};
}
