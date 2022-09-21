import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guard/login.guard';
import { EmployeeDetailComponent } from './pg-pool/employee/employee-detail/employee-detail.component';
import { EmployeeComponent } from './pg-pool/employee/employee.component';
import { EstimationComponent } from './pg-pool/estimation/estimation.component';
import { LogInComponent } from './pg-pool/log-in/log-in/log-in.component';
import { PgPoolComponent } from './pg-pool/pg-pool.component';
import { ProjectDetailComponent } from './pg-pool/project/project-detail/project-detail.component';
import { ProjectComponent } from './pg-pool/project/project.component';
const routes: Routes = [

  { path: '', redirectTo: 'pg-pool/login', pathMatch: 'full' },
  {
    path: 'pg-pool/login',
    component: LogInComponent
  },
  {
    path: 'pg-pool',
    component: PgPoolComponent,
    canActivate:[LoginGuard],
    children: [
      {
        path: '',
        component: ProjectComponent
      },
      {
        path: 'project',
        component: ProjectComponent
      },
      {
        path: 'employee',
        component: EmployeeComponent
      },
      {
        path: 'employee/detail/:id',
        component: EmployeeDetailComponent
      },
      {
        path: 'project/detail/:id',
        component: ProjectDetailComponent
      },
      {
        path: 'estimation',
        component: EstimationComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
