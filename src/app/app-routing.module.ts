import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AwsTestComponent } from "./components/aws-test/aws-test.component";

const routes: Routes = [
    {
        path: "aws-test",
        component: AwsTestComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
