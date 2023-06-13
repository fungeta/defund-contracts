import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NetworkComponent} from "./network.component";
import {NetworkDashboardComponent} from "./dashboard/network-dashboard.component";
import {TestComponent} from "./test/test.component";

const routes: Routes = [
    {
        path: '',
        component: NetworkComponent,
        children: [
            {path: 'dashboard', component: NetworkDashboardComponent},
            {path: 'test', component: TestComponent},
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NetworkRoutingModule {
}
