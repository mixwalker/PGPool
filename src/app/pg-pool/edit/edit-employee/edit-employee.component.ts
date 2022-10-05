import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {

  @Input() employeeList:any = {};
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  blockedImport: boolean = true;
  employee:any;
  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.employee = {...this.employeeList};
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

  updateEmployee() {
    this.pgpoolservice.updateEmployee(this.employee).subscribe({
      complete: () => {
        this.closeImport();
        this.messageService.add({ severity: 'success', summary: 'แก้ไขข้อมูลสำเร็จ', detail: 'ข้อมูลที่ต้องการถูกแก้ไขแล้ว' });
        setTimeout(() => { window.location.reload(); }, 2000)
      }, error: () => {
        this.closeImport();
        this.messageService.add({ severity: 'error', summary: 'แก้ไขข้อมูลไม่สำเร็จ', detail: 'ข้อมูลที่ต้องการยังไม่ถูกแก้ไข' });
      }
    });
  }
}
