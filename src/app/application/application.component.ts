import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {DipTestServiceService} from "./services/test/dip-test-service.service";
import {DipDialogService} from "./services/dialog/dip-dialog.service";
import {CreateDefundDialogComponent} from "./dialogs/create-defund/create-defund-dialog.component";
import {DipListItem} from "../shared/list/list.model";
import {Router} from "@angular/router";
import {DipSpinnerService} from "./services/spinner/dip-spinner.service";
import {FactoryContractService} from "./w3/factory-contract/factory-contract.service";

@Component({
    selector: 'dip-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

    @ViewChild('interactionSidenav') interactionSidenav: MatSidenav | undefined;

    public navigationMenu: DipListItem[] = [
        {
            title: "Network",
            router: ['app/network/dashboard'],
            onClick: this.navigateTo.bind(this),
            icon: 'assets/img/network.png'
        },
        {
            title: "My Portfolio",
            router: ['app/portfolio'],
            onClick: this.navigateTo.bind(this),
            icon: 'assets/img/my-portfolio.png'
        },
        {
            title: "Assets",
            router: ['app/assets'],
            onClick: this.navigateTo.bind(this),
            icon: 'assets/img/assets.png'
        },
        {
            title: "Integrations",
            router: ['app/integrations/dashboard'],
            onClick: this.navigateTo.bind(this),
            icon: 'assets/img/integrations.png'
        }
    ];

    public defundMenu: DipListItem[] = [

    ]

    constructor(private testService: DipTestServiceService,
                private dialogService: DipDialogService,
                private router: Router,
                private spinnerService: DipSpinnerService,
                private factoryCOntractService: FactoryContractService) {

        this.testService.sidenavEventEmiter.subscribe((option) => {
            this.openSidenav(option);
        });

        this.factoryCOntractService.connectedUserDefunds$.subscribe(defunds => {
            this.defundMenu = [];
            defunds.forEach(defund => {
                const item: DipListItem = {
                    title: defund.name,
                    router: [`app/defund/${defund.address}/dashboard`],
                    onClick: this.navigateTo.bind(this),
                    icon: 'assets/img/defund.png'
                };
                this.defundMenu.push(item);
            })
        });

    }

    openSidenav(option: string) {
        this.interactionSidenav?.toggle();
    }

    openCreateDefund() {
        this.dialogService.openDialog(CreateDefundDialogComponent, null, '30%', '50%');
    }

    navigateTo(item: DipListItem): void {
        if (item.router) {
            this.router.navigate(item.router);
        }
    }
}
