import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatLabel } from "@angular/material/form-field";
import { AwsTestComponent } from "./components/aws-test/aws-test.component";
import { MatOption, MatSelect } from "@angular/material/select";

@NgModule({
	declarations: [AppComponent, AwsTestComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatSidenavModule,
		MatMenuModule,
		MatLabel,
		MatDividerModule,
		MatCardModule,
		MatInputModule,
		ReactiveFormsModule,
		MatSelect,
		MatOption,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
