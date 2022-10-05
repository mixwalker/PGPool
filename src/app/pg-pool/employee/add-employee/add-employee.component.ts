import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  @Input() employeeList: any = {};
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  blockedImport: boolean = true;
  employee: any = {
    empNo: null,
    firstName: null,
    lastName: null,
    position: null,
    department: null,
    email: null
  };

  position: any[] = [
    { name: "Programmer" },
    { name: "Programmer Specialist 1"},
    { name: "Programmer Specialist 2"}
  ]
  department: any[] = [
    { name: "ADD" }
  ]
  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

  addEmployee() {
    
    this.employee.position = this.position[0].name;
    this.employee.department = this.department[0].name;
    this.pgpoolservice.addEmployee(this.employee).subscribe({
      complete: () =>{
        this.closeImport();
        this.messageService.add({ severity: 'success', summary: 'เพิ่มข้อมูลสำเร็จ', detail: 'เพิ่มข้อมูลพนักงานที่ต้องการเรียบร้อยแล้ว' });
        setTimeout(() => { window.location.reload(); }, 2000)
      },
      error:() =>{
        this.closeImport();
        this.messageService.add({ severity: 'error', summary: 'เพิ่มข้อมูลไม่สำเร็จ', detail: 'เพิ่มข้อมูลพนักงานไม่สำเร็จ' });
      }
    });
  }

}
