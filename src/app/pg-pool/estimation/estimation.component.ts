import { Component, OnInit } from '@angular/core';
import { Months } from 'src/app/model/months';
import { PGpoolService } from 'src/app/service/pgpool.service';


@Component({
  selector: 'app-estimation',
  templateUrl: './estimation.component.html',
  styleUrls: ['./estimation.component.scss']
})
export class EstimationComponent implements OnInit {

  amountEmployees: any;
  remaingEmployee: Number = 2;
  months: Months[];
  getMonthModel: any;
  getYearModel: any;
  years: any;
  projectList: any;
  projectInProgress: any[] = [];
  operation: any;
  employeeList: any;
  employeeWorking: any[] = [];
  employeeFree: any[] = [];
  employeeLeft: Number = 0;
  employeeAlmostDone: any[] = [];
  amountEmployeeWorking: Number = 0;
  amountEmployeeAlmostDone: Number = 0;
  amountEmployeeNeed: Number = 0;
  canRun: boolean = false;


  constructor(private pgpoolservice: PGpoolService) {
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

    this.pgpoolservice.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res;
      }, complete: () => {
      }
    });

    this.pgpoolservice.getAllEmplyoee().subscribe({
      next: (res: any) => {
        this.employeeList = res;
      }, complete: () => {
      }
    });
  }

  getMonthOnChange(event: any) {
    this.employeeWorking = [];
    this.employeeAlmostDone = [];
    this.getMonthModel = event['value']['code'];
    this.getProjectInProgress();
    const start = setInterval(() => {
      if (this.canRun) {
        this.getEmployeeFree();
        clearInterval(start);
      }
    }, 1000);
  }

  createYear() {
    let today = new Date();
    this.years = [
      { year: today.getFullYear() + 543 },
      { year: (today.getFullYear() + 1) + 543 },
      { year: (today.getFullYear() + 2) + 543 },
    ]
  }

  getYearOnChange(event: any) {
    this.employeeWorking = [];
    this.employeeAlmostDone = [];
    this.getYearModel = event['value']['year'];
    this.getProjectInProgress();
    const start = setInterval(() => {
      if (this.canRun) {
        this.getEmployeeFree();
        clearInterval(start);
      }
    }, 1000);
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
      let projectStartDate = new Date(project.projStartDate);
      let projectEndDate = new Date(formatDate.join('-') + 'T' + rawEndDate[1]);
      if (today >= projectStartDate && today <= projectEndDate) {
        this.projectInProgress.push({ ...project });
        this.amountEmployeeNeed += project.amountPerson;
      }
    }
    this.getEmployeeWorking();
  }

  getEmployeeWorking() {
    for (let project of this.projectInProgress) {
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
        let startDate = new Date(employeeWorkingData.startDate);
        let endDate = new Date(formatDate.join('-') + 'T' + rawEndDate[1]);
        if (today >= startDate && today <= endDate) {
          tempEmployeeWorking.push({
            empNo: operation['employee']['empNo'],
            Name: `${operation['employee']['firstName']} ${operation['employee']['lastName']}`,
            position: operation['employee']['position'],
            project: operation['project']['projName'], employeeWorkingData
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

  
  }

  getEmployeeAlmostDone() {
    let thismonth = new Date(+this.getYearModel - 543, this.getMonthModel, 0);
    let thismonth1 = new Date(+this.getYearModel - 543, this.getMonthModel - 1, 1);
    let tempEmployeeAlmostDone = [];
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
      this.canRun = true;
    } else return;

    let temp;
    this.amountEmployeeAlmostDone = 0;
    for (let employee of tempEmployeeAlmostDone) {
      console.log(employee['empNo'])
      if (employee['empNo'] != temp) {
        this.amountEmployeeAlmostDone = +this.amountEmployeeAlmostDone + 1;
        temp = employee['empNo'];
      }
    }
  }

}
