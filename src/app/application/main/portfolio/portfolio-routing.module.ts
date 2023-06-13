import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PortfolioComponent} from "./portfolio.component";
import {PortfolioDashboardComponent} from "./dashboard/portfolio-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: PortfolioComponent,
        children: [
            {path: 'dashboard', component: PortfolioDashboardComponent},
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PortfolioRoutingModule {
}
