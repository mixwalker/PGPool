import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PGpoolService } from 'src/app/service/pgpool.service';
import { auditTime, debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employeeList:any = [];
  constructor(private pgpoolservice:PGpoolService,private router:Router) { 
  }

  ngOnInit(): void {
    this.pgpoolservice.getAllEmplyoee().subscribe(response => {
      this.employeeList = response
    })
  }

  getEmployeeById(id:string){
    this.router.navigate(['pg-pool/employee/detail/',id])
  }

  inputSearch(inputEL: any, event: any){
    inputEL.filterGlobal(event.target.value, 'contains')
  }  


}
