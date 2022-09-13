import { Component, OnInit } from '@angular/core';
import { PGpoolService } from './service/pgpool.service';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  operationList:any;

  constructor(private pgpoolservice: PGpoolService) {}

  ngOnInit(): void {
    this.pgpoolservice.getAllOperation().subscribe({
      next:(res:any) =>{
        this.operationList = res
      },complete: () =>{
        setInterval(() => {   
          const today = new Date();
          today.setHours(17,0,0,0);
          let msToday = today.getTime();
          for(let operation of this.operationList){
            console.log(operation)
            for(let empOp of operation.employeeOperation){
              const endDate = new Date(empOp['endDate']);
              let msEndDate = endDate.getTime();
              let timeLeft = msToday - msEndDate;
              const oneWeek = 604800000;
              if(timeLeft<=oneWeek && today <= endDate){
                this.pgpoolservice.sendEmail({
                  to: operation['employee']['email'],
                  subject: `แจ้งเตือนโครงการ ${operation['project']['projName']} เหลือเวลาดำเนินการอีก 1 สัปดาห์`,
                  text: `เรียนคุณ ${operation['employee']['firstName']} ${operation['employee']['lastName']}
                  <br>โครงการที่กำลังดำเนินอยู่ในขณะนี้เหลือเวลาอีก 1 สัปดาห์เท่านั้น กรุณาประเมินระยะเวลาในการทำงานอย่างรอบคอบ`
                }).subscribe();
                console.log(operation['employee']['firstName'])
                console.log(operation['project']['projName'])
              }
            }
          }
        }, 86400000);
      }
    })
  }
  title = 'pg-pool-ui';

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data:SideNavToggle):void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
