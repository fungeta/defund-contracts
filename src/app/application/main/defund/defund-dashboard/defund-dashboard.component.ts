import {Component} from '@angular/core';
import {DefundDashboardTabs} from "./defund-dashboard.model";
import {ActivatedRoute} from "@angular/router";
import {FactoryContractService} from "../../../w3/factory-contract/factory-contract.service";
import {DefundSummary} from "../../network/dashboard/network-dashboard.model";
import {DipUtils} from "../../../../shared/dip-utils";
import {DefundService} from "../../../w3/defund/defund.service";
import {DipDialogService} from "../../../services/dialog/dip-dialog.service";
import {DepositDialogComponent} from "../../../dialogs/deposit/deposit-dialog.component";
import {WithdrawnDialogComponent} from "../../../dialogs/withdrawn/withdrawn-dialog.component";
import {SwapDialogComponent} from "../../../dialogs/swap/swap-dialog.component";

@Component({
    selector: 'dip-defund-dashboard',
    templateUrl: './defund-dashboard.component.html',
    styleUrls: ['./defund-dashboard.component.scss']
})
export class DefundDashboardComponent {

    // Utils
    public utils = DipUtils;

    public isManager = false;
    public defundAddres: string = '';
    public defundSummary: DefundSummary;
    public defundManager: string = "@Aadopii";
    public defundMembers: string = "97";

    public defundDashboardTabsList: string[] = [
        DefundDashboardTabs.OVERVIEW,
        DefundDashboardTabs.PORTFOLIO,
        DefundDashboardTabs.ACTIVITY
    ];

    public selectedTab: string = this.defundDashboardTabsList[0];
    protected readonly DefundDashboardTabs = DefundDashboardTabs;

    constructor(private route: ActivatedRoute, private factoryContractService: FactoryContractService, private defundService: DefundService, private dialogService: DipDialogService) {
        this.route.params.subscribe(params => {
            this.selectedTab = this.defundDashboardTabsList[0];
            this.defundAddres = params['defundAddress'];

            this.factoryContractService.defundsSummary$.subscribe(defunds => {
                this.defundSummary = defunds.find(defund => defund.address === this.defundAddres);
                if (!this.defundSummary) {
                    // TODO: ALERT AND GO TO NETWORK
                } else {
                    this.isManager = this.utils.isManager(this.defundSummary, this.factoryContractService.connectedUserAddress);
                    this.defundService.selectedDefund(this.defundSummary);

                }
            });

        });
    }

    checkDefundSelectorClass(selected: string): string {
        if (selected == this.selectedTab) {
            return 'defund-selector-active';
        }
        return 'defund-selector-not-active';
    }

    checkDefundSelector(selected: string): boolean {
        if (selected == this.selectedTab) {
            return true;
        }
        return false;
    }

    changeTab(tab: string) {
        this.selectedTab = tab;
    }

    getDefundDashboardTabLabel(tab: string) {
        return `app.defund.dashboard.tab.${tab}`
    }

    openDepositModal() {
        this.dialogService.openDialog(DepositDialogComponent, null, '30%', '40%');
    }

    openWithdrawnModal() {
        this.dialogService.openDialog(WithdrawnDialogComponent, null, '30%', '40%');
    }

    openSwapModal() {
        this.dialogService.openDialog(SwapDialogComponent, null, '30%', '55%');
    }
}
