import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
    DEFUNDS_COLUMNS,
    MANAGER_COLUMNS,
    DefundSummary,
    NetworkDashboardManagersGridItem, NO_FILTER_COLUMNS
} from "./network-dashboard.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {DipSelectOption} from "../../../../shared/dip-select/dip-select.model";
import {TableColumnDefinition} from "../../../../shared/dip-basic-table/basic-table.model";
import {combineLatest} from "rxjs";
import {DipUtils} from "../../../../shared/dip-utils";
import {FactoryContractService} from "../../../w3/factory-contract/factory-contract.service";
import {SmallCardModel} from "../../../../shared/small-card/small-card.model";
import {Router} from "@angular/router";

@Component({
    selector: 'dip-network-dashboard',
    templateUrl: './network-dashboard.component.html',
    styleUrls: ['./network-dashboard.component.scss']
})
export class NetworkDashboardComponent implements OnInit, AfterViewInit{

    // Utils
    public utils = DipUtils;

    // Cards
    public smallCards: SmallCardModel[] = [
        {
            title: "DeFunds",
            subtitle: "19.487",
            image: "assets/img/planet.png"
        },
        {
            title: "AUM",
            subtitle: "$1.000.863.954",
            image: "assets/img/coins.png"
        }
    ];

    // Tabs
    public tableTabs: string[] = [
        "DeFunds",
        "Managers"
    ];
    private selectedTab: string = this.tableTabs[0];

    // Table
    public defundsFilterInput: string = '';
    public managersFilterInput: string = '';

    public defundsColumns: TableColumnDefinition[] = DEFUNDS_COLUMNS;
    public managerColumns: TableColumnDefinition[] = MANAGER_COLUMNS;

    private defundsSelectedFilterColumn: string = this.defundsColumns[0].columnId;
    private managersSelectedFilterColumn: string = this.managerColumns[0].columnId;

    public defundsDataSource: MatTableDataSource<DefundSummary> = new MatTableDataSource<DefundSummary>();
    public managersDataSource: MatTableDataSource<NetworkDashboardManagersGridItem> = new MatTableDataSource<NetworkDashboardManagersGridItem>();

    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    constructor(private factoryContractService: FactoryContractService,
                private router: Router) {
        factoryContractService.defundsSummary$.subscribe((value) => console.log('factoryContractService.defundsSummary$.subscribe', value));
        factoryContractService.managersSummary$.subscribe((value) => console.log('factoryContractService.managersSummary$.subscribe', value));

        combineLatest([factoryContractService.defundsCount$, factoryContractService.totalAum$]).subscribe(([defundCount, totalAum]) => {
            this.smallCards[0].subtitle = defundCount.toString();
            this.smallCards[1].subtitle = this.utils.formatDollar(totalAum);
        });

        this.factoryContractService.contractLoaded$.subscribe((loaded) => {
            this.factoryContractService.getNetworkInformation();
        })

    }

    ngOnInit(): void {
        this.defundsDataSource.sortData = this.sortDefunds();
        this.managersDataSource.sortData = this.sortManagers();
    }

    ngAfterViewInit(): void {

        this.factoryContractService.defundsSummary$.subscribe((data: any[]) => {
            this.defundsDataSource.data = data;
        });

        this.factoryContractService.managersSummary$.subscribe((data: any[]) => {
            this.managersDataSource.data = data;
        });

        this.defundsDataSource.filterPredicate = this.createFilter();
        this.managersDataSource.filterPredicate = this.createFilter();

        this.defundsDataSource.paginator = this.paginator;
        this.defundsDataSource.sort = this.sort;

        this.managersDataSource.paginator = this.paginator;
        this.managersDataSource.sort = this.sort;
    }

    // Columns for the table
    public getDisplayedColumns(columns: TableColumnDefinition[]): string[] {
        return columns.map(column => column.columnId);
    }

    // Sort functions
    private sortDefunds() {
        return (items: DefundSummary[], sort: MatSort): DefundSummary[] => {
            if (!sort.active || sort.direction === '') {
                return items;
            }
            return items.sort((a: DefundSummary, b: DefundSummary) => {
                let comparatorResult = 0;
                switch (sort.active) {
                    case 'network-dashboard-defund-name':
                        comparatorResult = a.name.localeCompare(b.name);
                        break;
                    // case 'defund-portfolio-balance':
                    //     comparatorResult = a.balance.token >= (b.balance.token) ? 1 : -1;
                    //     break;
                    // case 'defund-portfolio-price':
                    //     comparatorResult = a.price.dollar >= (b.price.dollar) ? 1 : -1;
                    //     break;
                    default:
                        comparatorResult = a.name.localeCompare(b.name);
                        break;
                }
                return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
            });
        };
    }

    private sortManagers() {
        return (items: NetworkDashboardManagersGridItem[], sort: MatSort): NetworkDashboardManagersGridItem[] => {
            if (!sort.active || sort.direction === '') {
                return items;
            }
            return items.sort((a: NetworkDashboardManagersGridItem, b: NetworkDashboardManagersGridItem) => {
                let comparatorResult = 0;
                switch (sort.active) {
                    case 'network-dashboard-manager-name':
                        comparatorResult = a.name.localeCompare(b.name);
                        break;
                    // case 'defund-portfolio-balance':
                    //     comparatorResult = a.balance.token >= (b.balance.token) ? 1 : -1;
                    //     break;
                    // case 'defund-portfolio-price':
                    //     comparatorResult = a.price.dollar >= (b.price.dollar) ? 1 : -1;
                    //     break;
                    default:
                        comparatorResult = a.name.localeCompare(b.name);
                        break;
                }
                return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
            });
        };
    }

    // Filter functionsa
    private createFilter(): (data: any, filter: string) => boolean {
        return function (data: any, filter: string): boolean {
            let searchObject = JSON.parse(filter);
            let nameSearch = () => {
                let found = false;
                let columnId: string = searchObject.columnId;

                if (!data[columnId]) {
                    columnId = columnId.split("-")[columnId.split("-").length-1];
                }

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

    public getFilterColumns(columns: TableColumnDefinition[]): DipSelectOption[] {
        return columns
            .filter(column => (!NO_FILTER_COLUMNS.includes(column.columnId)))
            .map((column) => {
                return {
                    value: column.columnId,
                    label: column.columnHeader
                }
            });
    }

    public changeDefundsFilterColumn(columnId: string): void {
        this.defundsSelectedFilterColumn = columnId;
    }

    public changeManagersFilterColumn(columnId: string): void {
        this.managersSelectedFilterColumn = columnId;
    }

    public applyDefundFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        const filter = {
            columnId: this.defundsSelectedFilterColumn,
            filterText: filterValue.toLowerCase()
        }
        this.defundsDataSource.filter = JSON.stringify(filter);


        if (this.defundsDataSource.paginator) {
            this.defundsDataSource.paginator.firstPage();
        }
    }

    public applyManagersFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        const filter = {
            columnId: this.managersSelectedFilterColumn,
            filterText: filterValue.toLowerCase()
        }
        this.managersDataSource.filter = JSON.stringify(filter);


        if (this.managersDataSource.paginator) {
            this.managersDataSource.paginator.firstPage();
        }
    }

    // Tab functions
    public changeTab(tab: string): void {
        this.selectedTab = tab;
    }

    public isManagerTab(): boolean {
        return this.selectedTab === "Managers"
    }

    public isDefundsTab(): boolean {
        return this.selectedTab === "DeFunds"
    }

    openDefund(defund: DefundSummary): void {
        this.router.navigate([`app/defund/${defund.address}/dashboard`]);
    }
}
