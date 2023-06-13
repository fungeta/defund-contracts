import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicationComponent} from "./application.component";
import {DipAssetsComponent} from "./main/assets/dip-assets.component";

const routes: Routes = [
    {
        path: '',
        component: ApplicationComponent,
        children: [
            {
                path: 'network',
                loadChildren: () => import('./main/network/network.module').then(m => m.NetworkModule)
            },
            {
                path: 'integrations',
                loadChildren: () => import('./main/integrations/integrations.module').then(m => m.IntegrationsModule)
            },
            {
                path: 'defund',
                loadChildren: () => import('./main/defund/defund.module').then(m => m.DefundModule)
            },
            {
                path: 'portfolio',
                loadChildren: () => import('./main/portfolio/portfolio.module').then(m => m.PortfolioModule)
            },
            {
                path: 'assets',
                component: DipAssetsComponent
            },
            {path: '**', redirectTo: 'network'}
        ]

    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationRoutingModule {
}
