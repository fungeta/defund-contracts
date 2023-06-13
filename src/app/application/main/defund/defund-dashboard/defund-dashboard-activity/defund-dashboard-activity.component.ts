import {AfterViewInit, Component} from '@angular/core';
import {DEFUNDS_COLUMNS, DefundSummary} from "../../../network/dashboard/network-dashboard.model";
import {DipUtils} from "../../../../../shared/dip-utils";
import {TableColumnDefinition} from "../../../../../shared/dip-basic-table/basic-table.model";
import {DEFUND_ACTIVITY, DefundTransaction, TRANSACTION_TYPES} from "./defund-dashboard-activity.model";
import {Observable, of} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {DefundService} from "../../../../w3/defund/defund.service";

@Component({
    selector: 'app-defund-dashboard-activity',
    templateUrl: './defund-dashboard-activity.component.html',
    styleUrls: ['./defund-dashboard-activity.component.scss']
})
export class DefundDashboardActivityComponent implements AfterViewInit{

    public activityColumns: TableColumnDefinition[] = [
        {
            columnId: 'defund-dashboard-activity-info',
            columnHeader: ''
        },
        {
            columnId: 'defund-dashboard-activity-executor',
            columnHeader: ''
        },
        {
            columnId: 'defund-dashboard-activity-timestamp',
            columnHeader: ''
        }
    ];

    public utils = DipUtils;
    public transactionDataSource: MatTableDataSource<DefundTransaction> = new MatTableDataSource<DefundTransaction>();

    constructor(private defundService: DefundService) {
    }

    ngAfterViewInit(): void {
        // this.transactionDataSource.data = DEFUND_ACTIVITY;
        this.defundService.getAllTransactions();
        this.defundService.defundTransactions$.subscribe((transactions) => {
            this.transactionDataSource.data = transactions;
        })
    }


    getDisplayedColumns(columns: TableColumnDefinition[]): string[] {
        return columns.map(column => column.columnId);
    }

    isSwapTransaction(type: any): boolean {
        return type.toNumber() === 1;
    }

    getTransactionTitle(type: number): string {
        return TRANSACTION_TYPES[type];
    }
}
