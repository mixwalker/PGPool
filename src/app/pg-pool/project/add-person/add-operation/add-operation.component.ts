import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.scss']
})
export class AddOperationComponent implements OnInit {

  @Input() mode: number = 0;
  @Input() empNo: any = {};
  @Input() projRef: any = {};
  @Input() opId: any = {};
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  blockedImport: boolean = true;
  operation: any = {};
  employeeOperation: any = {
    operation: "",
    empAssigned: "",
    empDuration: "",
    empWorking: "",
    endDate: "",
    startDate: ""
  };

  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  addOperation() {
    if (this.mode == 1) {
      this.operation = {
        project: {
          projRef: this.projRef
        },
        employee: {
          empNo: this.empNo
        }
      }
      this.pgpoolservice.addOperation(this.operation).subscribe({
        next: (res: any) => {
          this.operation = res;
        },
        complete: () => {
          this.employeeOperation.operation = {
            opId: this.operation.opId
          }
          this.pgpoolservice.addEmpOperation(this.employeeOperation).subscribe({
            complete: () => {
              this.closeImport();
              this.messageService.add({ severity: 'success', summary: 'เพิ่มพนักงานสำเร็จ', detail: 'เพิ่มพนักงานลงโครงการสำเร็จ' });
              setTimeout(() => { window.location.reload(); }, 2000)
            }, error: () => {
              this.closeImport();
              this.messageService.add({ severity: 'error', summary: 'เพิ่มพนักงานไม่สำเร็จ', detail: 'เพิ่มพนักงานลงโครงการไม่สำเร็จ' });
              setTimeout(() => { window.location.reload(); }, 2000)
            }
          })
        }
      });
    } else {
      this.employeeOperation.operation = {
        opId: this.opId
      }
      this.pgpoolservice.addEmpOperation(this.employeeOperation).subscribe({
        complete: () => {
          this.closeImport();
          this.messageService.add({ severity: 'success', summary: 'เพิ่มพนักงานสำเร็จ', detail: 'เพิ่มพนักงานลงโครงการสำเร็จ' });
          setTimeout(() => { window.location.reload(); }, 2000)
        }, error: () => {
          this.closeImport();
          this.messageService.add({ severity: 'error', summary: 'เพิ่มพนักงานไม่สำเร็จ', detail: 'เพิ่มพนักงานลงโครงการไม่สำเร็จ' });
          setTimeout(() => { window.location.reload(); }, 2000)
        }
      })
    }
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

}
