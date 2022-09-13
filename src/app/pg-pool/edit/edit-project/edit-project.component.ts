import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  @Input() projectList: any = {};
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  blockedImport: boolean = true;
  project:any;
 
  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.project = {...this.projectList};
    this.project['projStartDate'] = new Date(this.project['projStartDate']);
    this.project['projEndDate'] = new Date(this.project['projEndDate']);
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

  updateProject() {
    this.pgpoolservice.updateProject(this.project).subscribe({
      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'แก้ไขข้อมูลสำเร็จ', detail: 'ข้อมูลที่ต้องการถูกแก้ไขแล้ว' });
        setTimeout(() => { window.location.reload(); }, 2000)
      }, error: () => {
        this.messageService.add({ severity: 'error', summary: 'แก้ไขข้อมูลไม่สำเร็จ', detail: 'ข้อมูลที่ต้องการยังไม่ถูกแก้ไข' });
      }
    });
  }

}
