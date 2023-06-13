import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './landing-page/landing-page.component';

const routes: Routes = [
    {path: 'home', component: LandingPageComponent},
    {
        path: 'app',
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule)
    },
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', component: LandingPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
