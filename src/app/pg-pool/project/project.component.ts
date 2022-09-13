import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { Months } from 'src/app/model/months';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [MessageService]
})
export class ProjectComponent implements OnInit {

  projectList: any = [];
  selectedProject: any;
  activate: boolean = false;
  projectStartDate: string = "";
  projectEndDate: string = "";
  cdgPic: string = "assets/picture/cdg.png";
  constructor(private pgpoolservice: PGpoolService, private router: Router, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.pgpoolservice.getAllProject().subscribe(res => {
      this.projectList = res;
    })
  }

  getProjectById(id: number) {
    this.router.navigate(['pg-pool/project/detail/', id]);
  }

  onActivate() {
    this.activate = true;
  }

  unActivate(unActivate: boolean) {
    this.activate = unActivate;
  }

  deleteItem(projRef: Number) {
    this.pgpoolservice.deleteProject(projRef).subscribe({
      complete: () => {
        this.messageService.add({severity:'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'ข้อมูลที่ต้องการลบถูกลบแล้ว'});
        setTimeout(() => { window.location.reload(); }, 2000)
      }, error: () => {
        this.messageService.add({severity:'error', summary: 'ลบข้อมูลไม่สำเร็จ', detail: 'ข้อมูลที่ต้องการลบยังไม่ถูกลบ'});
      }
    })
  }

  test(){
    this.pgpoolservice.sendEmail({
      to: "mixwalkerz1@gmail.com",
      subject:"test วันจันทร์",
      text:"halo"
    }).subscribe();
  }

}
