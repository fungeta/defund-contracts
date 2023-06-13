import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NetworkDashboardComponent} from './dashboard/network-dashboard.component';
import {SharedModule} from "../../../shared/shared.module";
import {NetworkComponent} from "./network.component";
import {NetworkRoutingModule} from "./network-routing.module";
import {TestComponent} from './test/test.component';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {TranslateModule} from "@ngx-translate/core";
import {MatSortModule} from "@angular/material/sort";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
    declarations: [
        NetworkComponent,
        NetworkDashboardComponent,
        TestComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        NetworkRoutingModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        TranslateModule,
        MatSortModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule
    ]
})
export class NetworkModule {
}
