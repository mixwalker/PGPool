import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  employeeList:any = {};
  selectedProject:any;
  data!:any;  
  table:any = {};

  constructor(private pgpoolservice:PGpoolService,private router:Router) { }

  ngOnInit(): void { 
    const url = this.router.url.split("/");
    const id = url[url.length-1];

    
    this.pgpoolservice.getEmplyoeeById(String(id)).subscribe(response => {
      this.employeeList = response;
    })
    this.pgpoolservice.getEmployeeProject(String(id)).subscribe(response => {
      this.table = response;
    })


  }

  getProjectById(id:number){
    this.router.navigate(['pg-pool/project/detail/',id]);
  }

  goEmployeePage(){
    this.router.navigate(['pg-pool/employee/']);
  }

}
