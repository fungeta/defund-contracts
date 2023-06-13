import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {IntegrationsComponent} from "./integrations.component";
import {IntegrationsRoutingModule} from "./integrations-routing.module";
import {IntegrationsDashboardComponent} from "./integrations-dashboard/integrations-dashboard.component";


@NgModule({
    declarations: [
        IntegrationsComponent,
        IntegrationsDashboardComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        IntegrationsRoutingModule
    ]
})
export class IntegrationsModule {
}
