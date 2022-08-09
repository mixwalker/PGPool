import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailComponent } from './pg-pool/employee/employee-detail/employee-detail.component';
import { EmployeeComponent } from './pg-pool/employee/employee.component';
import { PgPoolComponent } from './pg-pool/pg-pool.component';
import { ProjectDetailComponent } from './pg-pool/project/project-detail/project-detail.component';
import { ProjectComponent } from './pg-pool/project/project.component';
const routes: Routes = [
  { path: '', redirectTo: 'pg-pool/project', pathMatch: 'full' },{
    path: 'pg-pool',
    component: PgPoolComponent,
    children:[
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
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
