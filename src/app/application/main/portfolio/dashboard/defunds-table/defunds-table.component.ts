import {AfterViewInit, Component} from '@angular/core';
import {DipUtils} from "../../../../../shared/dip-utils";
import {DEFUNDS_COLUMNS} from "../../../network/dashboard/network-dashboard.model";
import {PORTFOLIO_DASHBOARD_DEFUND_COLUMNS, PortfolioDefundSummary, PortfolioManagerSummary} from "../portfolio.model";
import {MatTableDataSource} from "@angular/material/table";
import {PortfolioService} from "../../../../w3/portfolio/portfolio.service";
import {Observable} from "rxjs";

@Component({
  selector: 'dip-portfolio-dashboard-defunds-table',
  templateUrl: './defunds-table.component.html',
  styleUrls: ['./defunds-table.component.scss']
})
export class DefundsTableComponent implements AfterViewInit{

    public portfolioDefundSummary$: Observable<PortfolioDefundSummary[]>

    protected readonly DipUtils = DipUtils;
    protected readonly DEFUNDS_COLUMNS = DEFUNDS_COLUMNS;
    utils = DipUtils;
    defundsColumns = PORTFOLIO_DASHBOARD_DEFUND_COLUMNS ;
    defundsDataSource: MatTableDataSource<PortfolioDefundSummary> = new MatTableDataSource();

    constructor(private portfolioService: PortfolioService) {
        this.portfolioDefundSummary$ = portfolioService.defundsSummary$;
    }

    ngAfterViewInit(): void {
        this.portfolioService.defundsSummary$.subscribe(defundSummary => {
            this.defundsDataSource.data = defundSummary;
        })
    }


    getDisplayedColumns(defundsColumns: any) {
        return defundsColumns.map(defundsColumn => defundsColumn.columnId);
    }


}
