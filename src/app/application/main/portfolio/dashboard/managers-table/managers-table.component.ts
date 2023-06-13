import {AfterViewInit, Component} from '@angular/core';
import {DipUtils} from "../../../../../shared/dip-utils";
import {DEFUNDS_COLUMNS} from "../../../network/dashboard/network-dashboard.model";
import {
    PORTFOLIO_DASHBOARD_DEFUND_COLUMNS,
    PORTFOLIO_DASHBOARD_MANAGER_COLUMNS,
    PortfolioDefundSummary,
    PortfolioManagerSummary
} from "../portfolio.model";
import {MatTableDataSource} from "@angular/material/table";
import {PortfolioService} from "../../../../w3/portfolio/portfolio.service";
import {Observable} from "rxjs";

@Component({
  selector: 'dip-portfolio-dashboard-managers-table',
  templateUrl: './managers-table.component.html',
  styleUrls: ['./managers-table.component.scss']
})
export class ManagersTableComponent implements AfterViewInit{

    protected readonly DipUtils = DipUtils;
    utils = DipUtils;
    managerColumns = PORTFOLIO_DASHBOARD_MANAGER_COLUMNS ;
    defundsDataSource: MatTableDataSource<PortfolioManagerSummary> = new MatTableDataSource();

    constructor(private portfolioService: PortfolioService) {
    }

    ngAfterViewInit(): void {
        this.portfolioService.managersSummary$.subscribe(managerSummary => {
            this.defundsDataSource.data = managerSummary;
        })
    }

    getDisplayedColumns(columns: any) {
        return columns.map(column => column.columnId);
    }


}
