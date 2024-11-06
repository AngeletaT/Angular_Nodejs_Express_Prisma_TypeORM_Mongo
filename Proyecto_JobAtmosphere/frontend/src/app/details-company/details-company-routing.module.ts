import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsCompanyComponent } from './details-company.component';

const routes: Routes = [
    {
        path: '',
        component: DetailsCompanyComponent,
        resolve: {},
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DetailsCompanyRoutingModule { }