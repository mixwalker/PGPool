import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import {Message} from 'primeng//api';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class PGpoolService {

  constructor(private http: HttpClient,private messageService: MessageService) { 
  }

  getAllProject() {
    return this.http.get<any>('api/project');
  }

  getAllEmplyoee() {
    return this.http.get<any>('api/employee');
  }

  getEmplyoeeById(id:string) {
    return this.http.get<any>(`api/employee/${id}`);
  }

  getProjectById(id:string) {
    return this.http.get<any>(`api/project/${id}`);
  }

  getProjectEmployee(id:number){
    return this.http.get<any>(`api/operation/findproject/${id}`);
  }

  getEmployeeProject(id:string){
    return this.http.get<any>(`api/operation/findemployee/${id}`);
  }

  getProjectByProjCode(projCode:any){
    return this.http.get<any>(`api/project/findprojectbyprojcode/${projCode}`);
  }

  //post
  addEmployee(employee: any) {
    return this.http.post('api/employee', employee);
  }

  addProject(project: any) {
    return this.http.post('api/project', project);
  }

  addOperation(operation: any) {
    return this.http.post('api/operation', operation);
  }

  addEmpOperation(empOp: any) {
    return this.http.post('api/employee_operation', empOp);
  }


}
