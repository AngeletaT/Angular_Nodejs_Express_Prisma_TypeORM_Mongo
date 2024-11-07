import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruiterDashboardComponent } from './recruiter-dashboard.component';
import { AuthGuard } from '../core/guards/auth-guard.service';
import { UserTypeGuard } from '../core/guards/user-type-guard.service';

const routes: Routes = [
  {
    path: '',
    component: RecruiterDashboardComponent,
    canActivate: [AuthGuard, UserTypeGuard],
    data: { typeuser: 'recruiter' } // Solo accesible para empresas autenticadas
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruiterDashboardRoutingModule { }
