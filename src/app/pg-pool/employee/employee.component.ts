import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { PGpoolService } from 'src/app/service/pgpool.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  activate: boolean = false;
  employeeList: any = [];
  operationList:any = [];
  status:any;
  constructor(private pgpoolservice: PGpoolService, private router: Router,private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.pgpoolservice.getAllEmplyoee().subscribe(response => {
      this.employeeList = response
    });
  }

  getEmployeeById(id: string) {
    this.router.navigate(['pg-pool/employee/detail/', id])
  }

  inputSearch(inputEL: any, event: any) {
    inputEL.filterGlobal(event.target.value, 'contains')
  }

  deleteItem(empNo: string) {
    this.pgpoolservice.deleteEmployee(empNo).subscribe({
      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'ข้อมูลพนักงานที่ต้องการลบถูกลบแล้ว' });
        setTimeout(() => { window.location.reload(); }, 2000)
      }, error: () => {
        this.messageService.add({ severity: 'error', summary: 'ลบข้อมูลไม่สำเร็จ', detail: 'ข้อมูลที่พนักงานต้องการลบยังไม่ถูกลบ' });
      }
    })
  }

  onActivate() {
    this.activate = true;
  }

  unActivate(unActivate: boolean) {
    this.activate = unActivate;
  }


}
