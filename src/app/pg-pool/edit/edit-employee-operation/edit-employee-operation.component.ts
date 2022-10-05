import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-edit-employee-operation',
  templateUrl: './edit-employee-operation.component.html',
  styleUrls: ['./edit-employee-operation.component.scss']
})
export class EditEmployeeOperationComponent implements OnInit {

  @Input() empOpList: any = {};
  @Output() unBlock = new EventEmitter;
  blockedImport: boolean = true;
  empOp:any;
  
  constructor(private pgpoolservice: PGpoolService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.empOp = {...this.empOpList};
    this.empOp['startDate'] = new Date(this.empOp['startDate']);
    this.empOp['endDate'] = new Date(this.empOp['endDate']);
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

  updateProject() {
    this.pgpoolservice.updateEmployeeOperation(this.empOp).subscribe({
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
