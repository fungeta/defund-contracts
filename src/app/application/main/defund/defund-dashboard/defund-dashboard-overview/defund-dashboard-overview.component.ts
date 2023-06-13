import {Component, Input} from '@angular/core';
import {FactoryContractService} from "../../../../w3/factory-contract/factory-contract.service";
import {ProviderService} from "../../../../w3/provider/provider.service";
import {Observable} from "rxjs";
import {DefundSummary} from "../../../network/dashboard/network-dashboard.model";
import {DipUtils} from "../../../../../shared/dip-utils";
import {DefundService} from "../../../../w3/defund/defund.service";

@Component({
    selector: 'app-defund-dashboard-overview',
    templateUrl: './defund-dashboard-overview.component.html',
    styleUrls: ['./defund-dashboard-overview.component.scss']
})
export class DefundDashboardOverviewComponent {

    public utils = DipUtils;

    public defundSummary$: Observable<DefundSummary>;
    public myBalance$: Observable<number> = new Observable<number>();
    public defundDescription$: Observable<string>;

    performancePercentage: number = 9;

    public factoryContract: FactoryContractService;
    public provider: ProviderService;

    constructor(factoryContract: FactoryContractService, private defundService: DefundService) {
        this.factoryContract = factoryContract;
        this.defundSummary$ = this.defundService.selectedDefundSummary$;
        this.defundDescription$ = this.defundService.defundDescription$;
        this.myBalance$ = this.defundService.myBalance$;
    }
}
