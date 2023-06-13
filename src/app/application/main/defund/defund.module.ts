import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefundDashboardComponent} from './defund-dashboard/defund-dashboard.component';
import {DefundRoutingModule} from "./defund-routing.module";
import {DefundComponent} from "./defund.component";
import {SharedModule} from "../../../shared/shared.module";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {
    DefundDashboardOverviewComponent
} from './defund-dashboard/defund-dashboard-overview/defund-dashboard-overview.component';
import {
    DefundDashboardActivityComponent
} from './defund-dashboard/defund-dashboard-activity/defund-dashboard-activity.component';
import {TranslateModule} from "@ngx-translate/core";
import { DefundDashboardPortfolioComponent } from './defund-dashboard/defund-dashboard-portfolio/defund-dashboard-portfolio.component';
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";


@NgModule({
    declarations: [
        DefundComponent,
        DefundDashboardComponent,
        DefundDashboardOverviewComponent,
        DefundDashboardActivityComponent,
        DefundDashboardPortfolioComponent
    ],
    imports: [
        CommonModule,
        DefundRoutingModule,
        SharedModule,
        MatMenuModule,
        MatButtonModule,
        MatTabsModule,
        TranslateModule,
        MatSortModule,
        MatTableModule,
    ]
})
export class DefundModule {
}
