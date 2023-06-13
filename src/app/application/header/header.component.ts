import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {DipTestServiceService} from "../services/test/dip-test-service.service";
import {MetamaskService} from "../w3/metamask/metamask.service";
import {Observable, of} from "rxjs";
import {DipUtils} from "../../shared/dip-utils";

@Component({
    selector: 'dip-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    connectedAddress: string;
    utils = DipUtils;

    constructor(private router: Router, private testService: DipTestServiceService, private metamaskService: MetamaskService) {
        this.metamaskService.accountAddress$.subscribe((address) => {
            this.connectedAddress = address;
            console.log("Subscribe to accountAddress$", address);
        });
    }

    connectToWallet() {
        this.metamaskService.connectToAccount();
    }

    openSidenav() {
        this.testService.openSidenav("test");
    }

    checkConnectedAddress(address: string) {
        return address;
    }

    disconnectFromWallet() {
        this.metamaskService.disconnect();
    }
}
