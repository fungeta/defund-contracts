import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {PortfolioComponent} from "./portfolio.component";
import {PortfolioRoutingModule} from "./portfolio-routing.module";
import {PortfolioDashboardComponent} from "./dashboard/portfolio-dashboard.component";
import {MatTableModule} from "@angular/material/table";
import { DefundsTableComponent } from './dashboard/defunds-table/defunds-table.component';
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import {ManagersTableComponent} from "./dashboard/managers-table/managers-table.component";


@NgModule({
    declarations: [
        PortfolioComponent,
        PortfolioDashboardComponent,
        DefundsTableComponent,
        ManagersTableComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatTableModule,
        PortfolioRoutingModule,
        MatButtonModule,
        MatSortModule,
    ]
})
export class PortfolioModule {
}
