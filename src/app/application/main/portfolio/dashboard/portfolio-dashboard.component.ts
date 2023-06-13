import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {PortfolioService} from "../../../w3/portfolio/portfolio.service";
import {DipUtils} from "../../../../shared/dip-utils";

@Component({
    selector: 'dip-portfolio',
    templateUrl: './portfolio-dashboard.component.html',
    styleUrls: ['./portfolio-dashboard.component.scss']
})
export class PortfolioDashboardComponent {

    protected  utils = DipUtils;
    public myBalance$: Observable<number>;

    public myPortfolioSelectorOptions: string[] = [
        // "Assets",
        "Defunds",
        "Managers"
    ];

    public selectedTab = this.myPortfolioSelectorOptions[0];

    constructor(private portfolioService: PortfolioService) {
        this.myBalance$ = this.portfolioService.myBalance$;
        this.portfolioService.initPortfolio();
    }

    changeTab(tab: string) {
        this.selectedTab = tab;
    }

}
