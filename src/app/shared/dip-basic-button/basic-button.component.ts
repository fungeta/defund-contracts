import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'dip-basic-button',
    template: `
        <button [disabled]="disabled" mat-raised-button class="dip-basic-button" [ngClass]="getDisableClass()" (click)="onClick()">
            {{ label | translate}}
        </button>
    `,
    styleUrls: ['./basic-button.component.scss']
})
export class DipBasicButtonComponent {

    @Input() label: string = '';

    @Input() disabled: boolean = false;

    @Output() btnClick = new EventEmitter();

    onClick() {
        if (!this.disabled) {
            this.btnClick.emit();
        }
    }

    getDisableClass(): string {
        if (this.disabled) {
            return 'dip-basic-button-disabled'
        }
        return '';
    }
}
