import {EventEmitter, Injectable} from '@angular/core';
import {ComponentType} from "@angular/cdk/portal";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})
export class DipDialogService {

    public dialogClosed$: EventEmitter<any> = new EventEmitter<any>();

    constructor(public dialog: MatDialog) {
    }

    public openDialog(component: ComponentType<any>, data: any, width?: string, height?: string): MatDialogRef<any> {
        const dialogRef = this.dialog.open(component, {
            data: data,
            width: width ? width : '50%',
            height: height ? height : '80%',
            panelClass: 'default-dialog-class'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.dialogClosed$.emit(result);
        });

        return dialogRef;
    }

}
