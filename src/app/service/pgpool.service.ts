import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class PGpoolService {

  constructor(private http: HttpClient) { 
  }

  getAllProject() {
    return this.http.get<any>('api/project');
  }

  getAllEmplyoee() {
    return this.http.get<any>('api/employee');
  }

  getAllOperation() {
    return this.http.get<any>('api/operation');
  }

  getEmplyoeeById(id:string) {
    return this.http.get<any>(`api/employee/${id}`);
  }

  getProjectById(id:string) {
    return this.http.get<any>(`api/project/${id}`);
  }

  getOpertationByProject(id:number){
    return this.http.get<any>(`api/operation/findproject/${id}`);
  }

  getOpertationByEmployee(id:string){
    return this.http.get<any>(`api/operation/findemployee/${id}`);
  }

  getProjectByProjCode(projCode:any){
    return this.http.get<any>(`api/project/findprojectbyprojcode/${projCode}`);
  }

  getAmountEmployees(){
    return this.http.get<any>(`api/amount_employees`)
  }

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

  deleteEmployee(empNo:string){
    return this.http.delete(`api/employee/${empNo}`);
  }

  deleteProject(projRef:Number){
    return this.http.delete(`api/project/${projRef}`);
  }

  deleteOperation(projRef:Number,empNo:string){
    return this.http.delete(`api/operation/?projRef=${projRef}&empNo=${empNo}`);
  }

  updateProject(project:any){
    return this.http.put(`api/project/${project.projRef}`,project);
  }

  updateEmployee(employee:any){
    return this.http.put(`api/employee/${employee.empNo}`,employee);
  }

  updateEmployeeOperation(empOp:any){
    return this.http.put(`api/employee_operation/${empOp.empOpId}`,empOp);
  }

  sendEmail(emailData:any){
    return this.http.post(`mail/send`,emailData);
  }

  login(username:string,password:string){
    return this.http.get<any>(`api/users/auth?username=${username}&password=${password}`);
  }
}
