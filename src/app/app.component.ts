import { Component, OnInit } from '@angular/core';
import { PGpoolService } from './service/pgpool.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  operationList: any;
  projectList: any;

  constructor(private pgpoolservice: PGpoolService) { }

  ngOnInit(): void {
    this.pgpoolservice.getAllOperation().subscribe({
      next: (res: any) => {
        this.operationList = res
      }, complete: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let msToday = today.getTime();
        for (let operation of this.operationList) {
          for (let empOp of operation.employeeOperation) {
            const startDate = new Date(empOp['startDate']);
            const endDate = new Date(empOp['endDate']);
            let msEndDate = endDate.getTime();
            let timeLeft = msToday - msEndDate;
            const oneWeek = 604800000;
            setInterval(() => {
              if (timeLeft <= oneWeek && today <= endDate) {
                this.pgpoolservice.sendEmail({
                  to: operation['employee']['email'],
                  subject: `แจ้งเตือนโครงการ ${operation['project']['projName']} เหลือเวลาดำเนินการอีก 1 สัปดาห์`,
                  text: `เรียนคุณ ${operation['employee']['firstName']} ${operation['employee']['lastName']}
                  <br>โครงการที่กำลังดำเนินอยู่ในขณะนี้เหลือเวลาอีก 1 สัปดาห์เท่านั้น กรุณาประเมินระยะเวลาในการทำงานอย่างรอบคอบ`
                }).subscribe();
              }
            }, 86400000);
            if (today >= startDate && today <= endDate && operation['project']['status'] != 4) {
              operation['employee']['progress'] = empOp['empWorking'];
              this.pgpoolservice.updateEmployee(operation['employee']).subscribe();
              console.log(operation)
            }else{
              operation['employee']['progress'] = null;
              this.pgpoolservice.updateEmployee(operation['employee']).subscribe();
            }
          }
        }

      }
    })

    this.pgpoolservice.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res
      }, complete: () => {
        for (let project of this.projectList) {
          // console.log(project)
          const today = new Date();
          const endDate = new Date(project.projEndDate);
          endDate.setHours(23, 59, 59, 0);
          if (today >= endDate && project.status !== 4) {
            project.status = 3;
            this.pgpoolservice.updateProject(project).subscribe();
          }
        }
      }
    });
  }
  title = 'pg-pool-ui';

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
