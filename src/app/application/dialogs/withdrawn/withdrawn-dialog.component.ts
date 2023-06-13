import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DipSelectOption} from "../../../shared/dip-select/dip-select.model";
import {DefundService} from "../../w3/defund/defund.service";

@Component({
    templateUrl: './withdrawn-dialog.component.html',
    styleUrls: ['./withdrawn-dialog.component.scss']
})
export class WithdrawnDialogComponent {
    tokens: DipSelectOption[] = [
        {
            value: "USDT",
            label: "USDT",
        }
    ];
    amount: number = 0;

    constructor(public dialogRef: MatDialogRef<WithdrawnDialogComponent>, private defundService: DefundService) {

    }

    checkSubmitButton() {
        return this.amount <= 0;
    }

    closePopUp() {
        this.dialogRef.close();
    }

    withdrawn() {
        this.closePopUp();
        this.defundService.withdrawn(this.amount.toString());
    }
}
