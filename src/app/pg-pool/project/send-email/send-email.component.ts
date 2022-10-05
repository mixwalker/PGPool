import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  @Input() opList: any = {};
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  receiver: any[] = [
    { name: "ทุกคน" }
  ];
  selectReceiver!: any;
  subject: string = "";
  text: string = "";
  blockedImport: boolean = true;

  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
    for (let op of this.opList) {
      this.receiver.push({
        name: `${op.employee.firstName} ${op.employee.lastName}`,
        email: `${op.employee.email}`
      })
    }
  }

  sendEmail() {
    if (this.selectReceiver.name === "ทุกคน") {
      for (let receiver of this.receiver.slice(1)) {
        this.pgpoolservice.sendEmail({
          to: receiver['email'],
          subject: this.opList[0].project.projName + ": " + this.subject,
          text: this.text
        }).subscribe({
          complete: () => {
            this.messageService.add({ severity: 'success', summary: 'ส่ง E-Mail สำเร็จ', detail: 'ส่งข้อความที่ต้องการสำเร็จแล้ว' });
            this.closeImport();
          }, error: () => {
            this.messageService.add({ severity: 'error', summary: 'ส่ง E-Mail ไม่สำเร็จ', detail: 'ส่งข้อความที่ต้องการไม่สำเร็จ' });
          }
        });
      }
    } else {
      this.pgpoolservice.sendEmail({
        to: this.selectReceiver['email'],
        subject: this.opList[0].project.projName + ": " + this.subject,
        text: this.text
      }).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'ส่ง E-Mail สำเร็จ', detail: 'ส่งข้อความที่ต้องการสำเร็จแล้ว' });
          this.closeImport();
        }, error: () => {
          this.messageService.add({ severity: 'error', summary: 'ส่ง E-Mail ไม่สำเร็จ', detail: 'ส่งข้อความที่ต้องการไม่สำเร็จ' });
        }
      });
    }
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

}
