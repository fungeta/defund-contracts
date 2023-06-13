import {Component} from '@angular/core';
import {DipSpinnerService} from "./dip-spinner.service";

@Component({
    selector: 'dip-spinner',
    template: `
        <div *ngIf="isLoading$ | async" class="main-container">
            <div class="loading-container">
                <mat-spinner></mat-spinner>
            </div>
        </div>
    `,
    styleUrls: ['./dip-spinner.component.scss']
})
export class DipSpinnerComponent {

    isLoading$ = this.spinnerService.loading$;
    constructor(public spinnerService: DipSpinnerService) {}
}
