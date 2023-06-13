import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {TableColumnDefinition} from "./basic-table.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DipSelectOption} from "../dip-select/dip-select.model";
import {Observable} from "rxjs";

@Component({
    selector: 'dip-basic-table',
    templateUrl: './basic-table.component.html',
    styleUrls: ['./basic-table.component.scss']
})
export class DipBasicTableComponent implements AfterViewInit {

    @Input() filter: boolean = true;
    @Input() columns: TableColumnDefinition[] = [];
    @Input() data$: Observable<any[]>;
    @Input() tableTabs: string[] = [];

    @Input () topRow: boolean = true;
    dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedFilterColumn: string;
    input: string = "";

    constructor() {

    }

    ngAfterViewInit() {
        // Initialize the filter
        this.selectedFilterColumn = this.columns[0].columnId;
        // Assign the data to the data source for the table to render
        this.data$.subscribe((data: any[]) => {
            this.dataSource.data = data
        })
        if (this.topRow) {
            this.dataSource.filterPredicate = this.createFilter();
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        const filter = {
            columnId: this.selectedFilterColumn,
            filterText: filterValue.toLowerCase()
        }
        this.dataSource.filter = JSON.stringify(filter);


        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    getDisplayedColumns(): string[] {
        return this.columns.map((column) => column.columnId);
    }

    createFilter() {
        return function (data: any, filter: string): boolean {
            let searchObject = JSON.parse(filter);

            let nameSearch = () => {
                let found = false;
                const columnId = searchObject.columnId;
                const filterText = searchObject.filterText.trim();
                if (filterText.length === 0) {
                    return true;
                }
                filterText.toLowerCase().split(' ').forEach(word => {
                    if (data[columnId].toString().toLowerCase().indexOf(word) != -1) {
                        found = true
                    }
                });
                return found;
            }
            return nameSearch()
        }
    }

    getFilterColumns(): DipSelectOption[] {
        return this.columns.map((column) => {
            return {
                value: column.columnId,
                label: column.columnHeader
            }
        });
    }

    changeFilterColumn(columnId: string) {
        this.selectedFilterColumn = columnId;
    }
}
