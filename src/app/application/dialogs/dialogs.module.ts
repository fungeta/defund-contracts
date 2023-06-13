import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {CreateDefundDialogComponent} from "./create-defund/create-defund-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../shared/shared.module";
import {DepositDialogComponent} from "./deposit/deposit-dialog.component";
import {WithdrawnDialogComponent} from "./withdrawn/withdrawn-dialog.component";
import {SwapDialogComponent} from "./swap/swap-dialog.component";


@NgModule({
    declarations: [
        CreateDefundDialogComponent,
        DepositDialogComponent,
        WithdrawnDialogComponent,
        SwapDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        SharedModule,
        FormsModule
    ]
})
export class DialogsModule {
}
