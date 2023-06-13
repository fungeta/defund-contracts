import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DefundDashboardPortfolioGridItem} from "./defund-dashboard-portfolio.model";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DefundService} from "../../../../w3/defund/defund.service";

@Component({
    selector: 'dip-defund-dashboard-portfolio',
    templateUrl: './defund-dashboard-portfolio.component.html',
    styleUrls: ['./defund-dashboard-portfolio.component.scss']
})
export class DefundDashboardPortfolioComponent implements AfterViewInit, OnInit{
    displayedColumns: string[] = [
        'defund-portfolio-icon',
        'defund-portfolio-name',
        'defund-portfolio-balance',
        'defund-portfolio-price'
    ];

    data: DefundDashboardPortfolioGridItem[] = [
        {
            icon: 'assets/img/eth-icon.png',
            name: 'ETH',
            balance: {
                dollar: 44.70,
                percentage: 33.14,
                token: 22,
                tokenKey: 'ETH'
            },
            price: {
                dollar: 1.70,
                percentage: 3.14
            }
        },
        {
            icon: 'assets/img/matic-icon.png',
            name: 'MATIC',
            balance: {
                dollar: 44.70,
                percentage: 33.14,
                token: 25,
                tokenKey: 'ETH'
            },
            price: {
                dollar: 1.70,
                percentage: 3.14
            }
        },
        {
            icon: 'assets/img/ape-icon.png',
            name: 'APE',
            balance: {
                dollar: 44.70,
                percentage: 33.14,
                token: 30,
                tokenKey: 'ETH'
            },
            price: {
                dollar: 5.70,
                percentage: 3.14
            }
        },
        {
            icon: 'assets/img/uniswap-icon.png',
            name: 'UNI',
            balance: {
                dollar: 44.70,
                percentage: 33.14,
                token: 20,
                tokenKey: 'ETH'
            },
            price: {
                dollar: 20.70,
                percentage: 3.14
            }
        },
        {
            icon: 'assets/img/usdc-icon.png',
            name: 'USDC',
            balance: {
                dollar: 44.70,
                percentage: 33.14,
                token: 15,
                tokenKey: 'ETH'
            },
            price: {
                dollar: 10.70,
                percentage: 3.14
            }
        }
    ]

    dataSource: MatTableDataSource<DefundDashboardPortfolioGridItem> = new MatTableDataSource<DefundDashboardPortfolioGridItem>();
    @ViewChild(MatSort) sort: MatSort;

    constructor(private defundService: DefundService) {
        this.defundService.getPortfolio();
        // this.dataSource = new MatTableDataSource(this.data);
    }

    ngOnInit(): void {
        this.dataSource.sortData = this.sortData();
    }

    ngAfterViewInit() {

        this.defundService.defundPortfolio$.subscribe((portfolio) => {
            this.dataSource.data = portfolio;
        })

        this.dataSource.sort = this.sort;
    }

    // custom sort function
    sortData() {
        return (items: DefundDashboardPortfolioGridItem[], sort: MatSort): DefundDashboardPortfolioGridItem[] => {
            if (!sort.active || sort.direction === '') {
                return items;
            }
            return items.sort((a: DefundDashboardPortfolioGridItem, b: DefundDashboardPortfolioGridItem) => {
                let comparatorResult = 0;
                switch (sort.active) {
                    case 'defund-portfolio-name':
                        comparatorResult = a.name.localeCompare(b.name);
                        break;
                    case 'defund-portfolio-balance':
                        comparatorResult = a.balance.token >= (b.balance.token) ? 1 : -1;
                        break;
                    case 'defund-portfolio-price':
                        comparatorResult = a.price.dollar >= (b.price.dollar) ? 1 : -1;
                        break;
                    default:
                        comparatorResult = a.name.localeCompare(b.name);
                        break;
                }
                return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
            });
        };
    }

    getPercentageString(percentage: number): string {
        let percentageString: string = `${percentage}%`

        if (percentage > 0) {
            return '+' + percentageString;
        } else if (percentage < 0) {
            return '-' + percentageString;
        } else {
            return percentageString;
        }

    }

    getPerformanceClass(percentage: number): string {
        if (percentage > 0) {
            return 'positive-percentage';
        } else if (percentage < 0) {
            return 'negative-percentage';
        } else {
            return '';
        }
    }

}
