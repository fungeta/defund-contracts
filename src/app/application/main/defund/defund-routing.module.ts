import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefundComponent} from "./defund.component";
import {DefundDashboardComponent} from "./defund-dashboard/defund-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: DefundComponent,
        children: [
            {path: ':defundAddress/dashboard', component: DefundDashboardComponent},
            {path: '**', redirectTo: 'app/network/dashboard', pathMatch: 'full'}
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefundRoutingModule {
}
