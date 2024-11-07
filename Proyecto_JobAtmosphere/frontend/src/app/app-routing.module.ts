import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'company-dashboard',
    loadChildren: () =>
      import('./company-dashboard/company-dashboard.module').then(
        (m) => m.CompanyDashboardModule
      ),
  },
  {
    path: 'details-company/:name',
    loadChildren: () =>
      import('./details-company/details-company.module').then(
        (m) => m.DetailsCompanyModule
      ),
  },
  {
    path: 'recruiter-dashboard',
    loadChildren: () =>
      import('./recruiter-dashboard/recruiter-dashboard.module').then(
        (m) => m.RecruiterDashboardModule
      ),
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
