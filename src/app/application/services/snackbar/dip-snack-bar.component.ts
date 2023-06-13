import {Component, inject} from "@angular/core";
import {MatSnackBarModule, MatSnackBarRef} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'DipSnackBarComponent',
    template: `
        <span class="message-text" matSnackBarLabel>
            Your operation was completed successfully
        </span>
        <span matSnackBarActions>
<!--            <button mat-button matSnackBarAction (click)="snackBarRef.dismissWithAction()">🍕</button>-->
            <img class="dialog-close-icon" src="assets/img/close-white.png" (click)="snackBarRef.dismissWithAction()">
        </span>
    `,
    styles: [
        `
          :host {
            display: flex;
          }

          .message-text {
            color: #ffffff;
          }
        `,
    ]
})
export class DipSnackBarComponent {
    snackBarRef = inject(MatSnackBarRef);
}
