import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntegrationsComponent} from "./integrations.component";
import {IntegrationsDashboardComponent} from "./integrations-dashboard/integrations-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: IntegrationsComponent,
        children: [
            {path: 'dashboard', component: IntegrationsDashboardComponent},
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntegrationsRoutingModule {
}
