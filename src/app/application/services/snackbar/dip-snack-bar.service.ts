import {EventEmitter, Injectable} from '@angular/core';
import {ComponentType} from "@angular/cdk/portal";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DipSnackBarComponent} from "./dip-snack-bar.component";

@Injectable({
    providedIn: 'root'
})
export class DipSnackBarService {

    constructor(private snackBar: MatSnackBar) {
    }

    public openSnackbar() {
        this.snackBar.openFromComponent(DipSnackBarComponent, {
            duration: 5000,
        });
    }

}
