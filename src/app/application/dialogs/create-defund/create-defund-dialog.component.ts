import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DipSelectOption} from "../../../shared/dip-select/dip-select.model";
import {FactoryContractService} from "../../w3/factory-contract/factory-contract.service";
import {from, tap} from "rxjs";

@Component({
    templateUrl: './create-defund-dialog.component.html',
    styleUrls: ['./create-defund-dialog.component.scss']
})
export class CreateDefundDialogComponent {
    networks: DipSelectOption[] = [
        {
            value: "Etherium",
            label: "Etherium",
        },
        {
            value: "Polygon",
            label: "Polygon",
        }
    ];
    defundName: string = '';
    defundDescription: string = '';

    constructor(public dialogRef: MatDialogRef<CreateDefundDialogComponent>, private factoryContractService: FactoryContractService) {

    }

    closePopUp() {
        this.dialogRef.close();
    }

    createDefund() {
        this.closePopUp();
        this.factoryContractService.createDefund(this.defundName, this.defundDescription);
        this.factoryContractService.printDeployedDefunds().subscribe((value) => console.log("Print deployed", value));
    }

    checkSubmitBtn(): boolean {
        return !(this.defundName != '' && this.defundDescription != '');
    }
}
