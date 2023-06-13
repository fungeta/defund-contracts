import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DipBasicButtonComponent} from './dip-basic-button/basic-button.component';
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {DipSmallCardComponent} from './small-card/small-card.component';
import {MatCardModule} from "@angular/material/card";
import {DipBasicTableComponent} from './dip-basic-table/basic-table.component';
import {MatTableModule} from "@angular/material/table";
import {DipListComponent} from './list/list.component';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {TableOverviewExample} from "./table-overview-example/table-overview-example.component";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {CdkFixedSizeVirtualScroll} from "@angular/cdk/scrolling";
import { DipSelectComponent } from './dip-select/dip-select.component';
import { ClickOutsideDirective } from './dip-select/click-outside.directive';
import { DipSlideSelectorComponent } from './dip-slide-selector/dip-slide-selector.component';
import {DipSpinnerComponent} from "../application/services/spinner/dip-spinner.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DipSnackBarComponent} from "../application/services/snackbar/dip-snack-bar.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";


@NgModule({
    declarations: [
        DipBasicButtonComponent,
        DipSmallCardComponent,
        DipBasicTableComponent,
        DipListComponent,
        TableOverviewExample,
        DipSelectComponent,
        ClickOutsideDirective,
        DipSlideSelectorComponent,
        DipSpinnerComponent,
        DipSnackBarComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        TranslateModule,
        MatCardModule,
        MatTableModule,
        MatListModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        FormsModule,
        CdkFixedSizeVirtualScroll,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    exports: [
        DipBasicButtonComponent,
        DipSmallCardComponent,
        DipBasicTableComponent,
        DipListComponent,
        TableOverviewExample,
        DipSlideSelectorComponent,
        DipSelectComponent,
        DipSpinnerComponent,
        DipSnackBarComponent
    ]
})
export class SharedModule {
}
