import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Months } from 'src/app/model/months';
import { PGpoolService } from 'src/app/service/pgpool.service';


@Component({
  selector: 'app-estimation',
  templateUrl: './estimation.component.html',
  styleUrls: ['./estimation.component.scss']
})
export class EstimationComponent implements OnInit {

  amountEmployees: any;
  months: Months[];
  getMonthModel: any;
  getYearModel: any;
  years: any;
  projectList: any;
  projectRequest: any[] = [];
  projectInProgress: any[] = [];
  operation: any;
  employeeList: any;
  employeeWorking: any[] = [];
  employeeFree: any[] = [];
  employeeLeft: number = 0;
  employeeAlmostDone: any[] = [];
  amountEmployeeWorking: number = 0;
  amountEmployeeAlmostDone: number = 0;
  amountEmployeeNeed: number = 0;
  amountEmployeeNeedPerMonth: number = 0;
  countEmployee: number = 0;
  approveProjObj: any = {};
  approveProjectInProgress: any[] = [];
  canRun: boolean = false;
  tempArr: any[] = [];
  selectMonth: any;
  selectYear: any;


  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) {
    this.months = [
      { name: 'มกราคม', code: '01' },
      { name: 'กุมภาพันธ์', code: '02' },
      { name: 'มีนาคม', code: '03' },
      { name: 'เมษายน', code: '04' },
      { name: 'พฤษภาคม', code: '05' },
      { name: 'มิถุนายน', code: '06' },
      { name: 'กรกฎาคม', code: '07' },
      { name: 'สิงหาคม', code: '08' },
      { name: 'กันยายน', code: '09' },
      { name: 'ตุลาคม', code: '10' },
      { name: 'พฤศจิกายน', code: '11' },
      { name: 'ธันวาคม', code: '12' }
    ];
  }

  ngOnInit(): void {
    this.pgpoolservice.getAmountEmployees().subscribe(res => {
      this.amountEmployees = res;
    });

    this.pgpoolservice.getAllProject().subscribe(res => {
      this.projectList = res;
    });

    this.pgpoolservice.getAllEmplyoee().subscribe(res => {
      this.employeeList = res;
    });

    let today = new Date();
    this.years = [
      { year: (today.getFullYear() - 2) + 543 },
      { year: (today.getFullYear() - 1) + 543 },
      { year: today.getFullYear() + 543 },
      { year: (today.getFullYear() + 1) + 543 },
      { year: (today.getFullYear() + 2) + 543 },
    ]

  }

  getMonthOnChange(event: any) {
    this.employeeWorking = [];
    this.employeeAlmostDone = [];
    this.getMonthModel = event['value']['code'];
    if (!this.getMonthModel || !this.getYearModel) return;
    this.pgpoolservice.getApproveProjectByQuery(this.getMonthModel, this.getYearModel).subscribe({
      next: (res: any) => {
        this.approveProjObj = res
      },
      complete: () => {
        this.getProjectInProgress();
        this.getProjectRequest();
        this.getApproveProjectInProgress();
        const start = setInterval(() => {
          if (this.canRun) {
            this.getEmployeeFree();
            clearInterval(start);
          }
        }, 1000);
      }
    });
  }

  getYearOnChange(event: any) {
    this.employeeWorking = [];
    this.employeeAlmostDone = [];
    this.getYearModel = event['value']['year'];
    if (!this.getMonthModel || !this.getYearModel) return;
    this.pgpoolservice.getApproveProjectByQuery(this.getMonthModel, this.getYearModel).subscribe({
      next: (res: any) => {
        this.approveProjObj = res
      },
      complete: () => {
        this.getProjectInProgress();
        this.getProjectRequest();
        this.getApproveProjectInProgress();
        const start = setInterval(() => {
          if (this.canRun) {
            this.getEmployeeFree();
            clearInterval(start);
          }
        }, 1000);
      }
    });
  }

  getProjectInProgress() {
    if (!this.getMonthModel || !this.getYearModel) return;
    let today = new Date(+this.getYearModel - 543, this.getMonthModel, 0);
    this.projectInProgress = [];
    this.amountEmployeeNeed = 0;
    for (let project of this.projectList) {
      let rawEndDate = project.projEndDate.split('T')
      let formatDate = rawEndDate[0].split('-')
      formatDate[1] = (+formatDate[1] + 1).toString().padStart(2, '0')
      if (formatDate[1] > 12) {
        formatDate[1] = (formatDate[1] = 1).toString().padStart(2, '0')
        formatDate[0] = (+formatDate[0] + 1).toString().padStart(2, '0');
      }
      let projectStartDate = new Date(project.projStartDate);
      let projectEndDate = new Date(formatDate.join('-') + 'T' + rawEndDate[1]);
      if (today >= projectStartDate && today <= projectEndDate && project.status != 1 && project.status != 4) {
        this.projectInProgress.push({ ...project });
      }
    }
  }

  async getProjectRequest() {
    if (!this.getMonthModel || !this.getYearModel) return;
    let tempProjectProgress = [...this.projectInProgress]
    this.projectRequest = [];
    this.amountEmployeeNeed = 0;
    this.canRun = true;
    if (this.approveProjObj.length > 0) {
      for (let approve of this.approveProjObj) {
        const index = tempProjectProgress.map(obj => obj.projRef.toString()).indexOf(approve['approveProjRef']);
        if (index > -1) {
          tempProjectProgress.splice(index, 1);
        }
      }
      await this.countPersonAndPostProject(tempProjectProgress);
    } else {
      await this.countPersonAndPostProject(tempProjectProgress);
    }
  }

  async countPersonAndPostProject(projectList: any) {
    let today = new Date(+this.getYearModel - 543, this.getMonthModel, 0);
    let run = false;
    let tempEmpList = [...this.employeeList];
    for (let project of projectList) {
      let amount = 0;
      let empNoArr: any[] = [];
      this.pgpoolservice.getOpertationByProject(project['projRef']).subscribe({
        next: (res: any) => {
          this.operation = res;
        }, complete: () => {
          for (let op of this.operation) {
            for (let empOp of op.employeeOperation) {
              let rawEndDate = empOp.endDate.split('T')
              let formatDate = rawEndDate[0].split('-')
              formatDate[1] = (+formatDate[1] + 1).toString().padStart(2, '0')
              if (formatDate[1] > 12) {
                formatDate[1] = (formatDate[1] = 1).toString().padStart(2, '0')
                formatDate[0] = (+formatDate[0] + 1).toString().padStart(2, '0');
              }
              let startDate = new Date(empOp.startDate);
              let endDate = new Date(formatDate.join('-') + 'T' + rawEndDate[1]);
              if (today >= startDate && today <= endDate) {
                empNoArr.push(op.employee.empNo);
                const index = tempEmpList.map(obj => obj.empNo).indexOf(op['employee']['empNo']);
                if (index > -1) {
                  tempEmpList.splice(index, 1);
                }
              }
            }
          }
          let tempEmpNo;
          for (let empNo of empNoArr) {
            if (tempEmpNo != empNo) {
              amount += 1;
              run = true;
            }
            tempEmpNo = empNo;
          }
        }
      });
      const start = setInterval(() => {
        if (run) {
          project.personNeedPerMonth = amount
          this.amountEmployeeNeedPerMonth = this.employeeList.length - tempEmpList.length
          this.projectRequest.push({ ...project });
          clearInterval(start);
        }
      }, 1000);
    }

  }

  approveProject(projRef: any) {
    let ApproveProject = {
      approveProjRef: projRef,
      approveMonth: this.getMonthModel,
      approveYears: this.getYearModel,
      approveStatus: true
    }

    this.pgpoolservice.addApproveProject(ApproveProject).subscribe({
      complete: () => {
        setTimeout(() => { window.location.reload(); }, 2000)
        this.messageService.add({ severity: 'success', summary: 'อนุมัติสำเร็จ', detail: 'คำร้องขอพนักงานได้รับการอนุมัติแล้ว' });
      }
    })
  }

  getApproveProjectInProgress() {
    if (!this.getMonthModel || !this.getYearModel) return;
    this.approveProjectInProgress = [];
    this.amountEmployeeNeed = 0;
    for (let project of this.projectInProgress) {
      for (let approve of this.approveProjObj) {
        if (approve.approveProjRef == project.projRef) {
          this.approveProjectInProgress.push({ ...project });
        }
      }
      this.pgpoolservice.getOpertationByProject(project['projRef']).subscribe(res => {
        this.operation = res;
      });
    }
    this.getEmployeeWorking();
  }

  getEmployeeWorking() {
    for (let project of this.approveProjectInProgress) {
      this.pgpoolservice.getOpertationByProject(project['projRef']).subscribe({
        next: (res: any) => {
          this.operation = res;
        }, complete: () => {
          this.addEmployeetoEmployeeWorking();
          this.getEmployeeAlmostDone();
        }
      });
    }
  }

  addEmployeetoEmployeeWorking() {
    let today = new Date(+this.getYearModel - 543, this.getMonthModel, 0);
    let tempEmployeeWorking = [];
    for (let operation of this.operation) {
      for (let employeeWorkingData of operation['employeeOperation']) {
        let rawEndDate = employeeWorkingData.endDate.split('T')
        let formatDate = rawEndDate[0].split('-')
        formatDate[1] = (+formatDate[1] + 1).toString().padStart(2, '0')
        if (formatDate[1] > 12) {
          formatDate[1] = (formatDate[1] = 1).toString().padStart(2, '0')
          formatDate[0] = (+formatDate[0] + 1).toString().padStart(2, '0');
        }
        let startDate = new Date(employeeWorkingData.startDate);
        let endDate = new Date(formatDate.join('-') + 'T' + rawEndDate[1]);
        if (today >= startDate && today <= endDate) {
          tempEmployeeWorking.push({
            empNo: operation['employee']['empNo'],
            Name: `${operation['employee']['firstName']} ${operation['employee']['lastName']}`,
            position: operation['employee']['position'],
            project: operation['project']['projName'],
            employeeWorkingData
          });
        }
      }
    }

    if (tempEmployeeWorking.length > 0) {
      this.employeeWorking.push(tempEmployeeWorking);
      this.canRun = true;
    } else return;
  }

  getEmployeeFree() {
    if (!this.getMonthModel || !this.getYearModel) return;
    this.employeeFree = [...this.employeeList];
    if (this.employeeWorking) {
      for (let projectArr of this.employeeWorking) {
        for (let empArr of projectArr) {
          const index = this.employeeFree.map(obj => obj.empNo).indexOf(empArr['empNo']);
          if (index > -1) {
            this.employeeFree.splice(index, 1);
          }
        }
      }
    }
    this.employeeLeft = this.employeeFree.length;
    this.amountEmployeeWorking = this.employeeList.length - +this.employeeLeft;
    this.amountEmployeeNeed = this.employeeList.length - +this.employeeLeft;
  }

  getEmployeeAlmostDone() {
    let thismonth = new Date(+this.getYearModel - 543, this.getMonthModel, 0);
    let thismonth1 = new Date(+this.getYearModel - 543, this.getMonthModel - 1, 1);
    let tempEmployeeAlmostDone = [];
    this.amountEmployeeAlmostDone = 0;
    for (let operation of this.operation) {
      for (let employeeWorkingData of operation['employeeOperation']) {
        let endDate = new Date(employeeWorkingData.endDate);
        if (endDate >= thismonth1 && endDate <= thismonth) {
          tempEmployeeAlmostDone.push({
            empNo: operation['employee']['empNo'],
            Name: `${operation['employee']['firstName']} ${operation['employee']['lastName']}`,
            position: operation['employee']['position'],
            project: operation['project']['projName'], employeeWorkingData
          });
        }
      }
    }
    if (tempEmployeeAlmostDone.length > 0) {
      this.employeeAlmostDone.push(tempEmployeeAlmostDone);
      tempEmployeeAlmostDone.map(obj => this.tempArr.push(obj.empNo))
      this.canRun = true;
    } else return;
    const setTemp = new Set(this.tempArr)
    this.amountEmployeeAlmostDone = setTemp.size;
  }

}
