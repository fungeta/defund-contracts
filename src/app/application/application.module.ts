import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationComponent} from './application.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {SharedModule} from "../shared/shared.module";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {ApplicationRoutingModule} from "./application-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {DialogsModule} from "./dialogs/dialogs.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {TranslateModule} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import { DipAssetsComponent } from './main/assets/dip-assets.component';
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";


@NgModule({
    declarations: [
        ApplicationComponent,
        HeaderComponent,
        FooterComponent,
        DipAssetsComponent
    ],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        SharedModule,
        ApplicationRoutingModule,
        MatButtonModule,
        DialogsModule,
        MatDialogModule,
        MatListModule,
        TranslateModule,
        MatMenuModule,
        MatSortModule,
        MatTableModule
    ]
})
export class ApplicationModule {
}
