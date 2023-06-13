import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DefundService} from "../../w3/defund/defund.service";
import {DepositDialogToken} from "../deposit/deposit-dialog.model";

@Component({
    templateUrl: './swap-dialog.component.html',
    styleUrls: ['./swap-dialog.component.scss']
})
export class SwapDialogComponent {
    tokens: DepositDialogToken[] = [
        {
            value: "WETH",
            label: "WETH",
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        },
        {
            value: "LINK",
            label: "LINK",
            address: "0x514910771AF9Ca656af840dff83E8264EcF986CA"
        },
        {
            value: "WBTC",
            label: "WBTC",
            address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
        },
        {
            value: "DAI",
            label: "DAI",
            address: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
        }
    ];
    amount: number = 0;
    tokenFrom: DepositDialogToken = this.tokens[0];
    tokenTo: DepositDialogToken = this.tokens[1];

    constructor(public dialogRef: MatDialogRef<SwapDialogComponent>, private defundService: DefundService) {

    }

    checkSubmitButton() {
        return this.amount <= 0;
    }

    closePopUp() {
        this.dialogRef.close();
    }

    swap() {
        this.closePopUp();
        this.defundService.swap(this.amount.toString(), this.tokenFrom.address, this.tokenTo.address);
    }

    changeFromToken(token: DepositDialogToken) {
        this.tokenFrom = token;
    }

    changeToToken(token: DepositDialogToken) {
        this.tokenTo = token;
    }
}
