import { Component, OnInit, ɵisListLikeIterable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Months } from 'src/app/model/months';
import { PGpoolService } from 'src/app/service/pgpool.service';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  projectList: any = {};
  selectedEmployee: any;
  table: any = {};
  chart: any;
  months: Months[];
  selectedMonth!: Months;
  numtest!: number;
  mainYears: any = [];
  subYears: any = [];
  getMainYearModel!: any;
  getSubYearModel!: any;
  getSubMonthModel!: any;
  cantLoad: boolean = false;
  cantLoadEmp: boolean = false;
  mainChartOptions: any;
  subChartOptions: any;
  mainChart: any;
  activate: boolean = false;
  amountPerson!:number;

  constructor(private pgpoolservice: PGpoolService, private router: Router, private messageService: MessageService) {
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
    const url = this.router.url.split('/');
    const id = url[url.length - 1];

    this.pgpoolservice.getProjectById(String(id)).subscribe({
      next: (res: any) => {
        this.projectList = res;
        this.cantLoad = true;
        this.amountPerson = this.projectList['amountPerson'];
      },
      complete: () => {
        this.pgpoolservice.getOpertationByProject(Number(id)).subscribe({
          next: (res: any) => {
            this.table = res;
            this.cantLoadEmp = true;
          },
          complete: () => {
            this.getMainChartYear();
            this.getMainChartData();
          }
        });
      },
    });
  }

  getEmployeeById(id: number) {
    this.router.navigate(['pg-pool/employee/detail/', id])
  }

  goProjectPage() {
    this.router.navigate(['pg-pool/project/']);
  }

  getMainChartYear() {
    this.mainYears = [];
    let arrYear = [];
    let startYear = new Date(this.projectList['projStartDate']).getFullYear();
    let endYear = new Date(this.projectList['projEndDate']).getFullYear();
    arrYear.push(startYear, endYear);
    let min = Math.min(...arrYear);
    let max = Math.max(...arrYear);
    for (let i = min; i <= max; i++) {
      this.mainYears.push({ year: i + 543 });
    }
  }

  getSubChartYear(empOperation: any) {
    this.subYears = []
    let arrYear = [];
    for (let empOp of empOperation) {
      let startYear = new Date(empOp['startDate']).getFullYear();
      let endYear = new Date(empOp['endDate']).getFullYear();
      arrYear.push(startYear, endYear);
    }
    let min = Math.min(...arrYear);
    let max = Math.max(...arrYear);
    for (let i = min; i <= max; i++) {
      this.subYears.push({ year: i + 543 });
    }
  }

  selectMonthData(empOperation: any) {
    if (!this.getSubMonthModel || !this.getSubYearModel) return;
    const month = this.getSubMonthModel['name'];
    const year = this.getSubYearModel['year'];
    switch (month) {
      case 'มกราคม':
        this.getSubChart(31, 'ม.ค', 1, year, empOperation);
        break;
      case 'กุมภาพันธ์':
        this.getSubChart(28, 'ก.พ', 2, year, empOperation);
        break;
      case 'มีนาคม':
        this.getSubChart(31, 'มี.ค', 3, year, empOperation);
        break;
      case 'เมษายน':
        this.getSubChart(30, 'เม.ษ', 4, year, empOperation);
        break;
      case 'พฤษภาคม':
        this.getSubChart(31, 'พ.ค', 5, year, empOperation);
        break;
      case 'มิถุนายน':
        this.getSubChart(30, 'มิ.ย', 6, year, empOperation);
        break;
      case 'กรกฎาคม':
        this.getSubChart(31, 'ก.ค', 7, year, empOperation);
        break;
      case 'สิงหาคม':
        this.getSubChart(31, 'ส.ค', 8, year, empOperation);
        break;
      case 'กันยายน':
        this.getSubChart(30, 'ก.ย', 9, year, empOperation);
        break;
      case 'ตุลาคม':
        this.getSubChart(31, 'ต.ค', 10, year, empOperation);
        break;
      case 'พฤศจิกายน':
        this.getSubChart(30, 'พ.ย', 11, year, empOperation);
        break;
      case 'ธันวาคม':
        this.getSubChart(31, 'ธ.ค', 12, year, empOperation);
        break;
    }
  }

  getMainChartData() {
    this.applyMinMaxMainChart();
    let thisyear;
    if (!this.getMainYearModel) {
      let projStart = new Date(this.projectList['projStartDate']).getFullYear();
      this.getMainYearModel = { year: projStart };
      thisyear = this.getMainYearModel['year'];
    } else {
      thisyear = this.getMainYearModel['year'] - 543;
    }

    this.mainChart = {
      labels: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม',
        'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม ', 'สิงหาคม', 'กันยายน ',
        'ตุลาคม ', 'พฤศจิกายน ', 'ธันวาคม '],
      datasets: [],
    };

    for (let emp of this.table) {
      let name = emp.employee.firstName + " " + emp.employee.lastName;
      let datasets: any = {
        label: name,
        data: [],
        fill: true,
        borderColor: '#FFA726',
        tension: .4,
        backgroundColor: 'rgba(255,167,38,0.2)'
      }
      let sumArr = [];
      for (let empOp of emp.employeeOperation) {
        let workingArr = [];
        let rawEndDate = empOp['endDate'].split('T')
        let formatDate = rawEndDate[0].split('-')
        formatDate[1] = (+formatDate[1] + 1).toString().padStart(2, '0')
        let startDate = new Date(empOp['startDate']);
        let endDate = new Date(formatDate.join('-') + 'T' + rawEndDate[1]);
        for (let i = 0; i < this.mainChart.labels.length; i++) {
          let today = new Date(+thisyear, i + 1, 0);
          if (today >= startDate && today <= endDate) {
            workingArr.push(empOp.empWorking);
          } else {
            workingArr.push(0);
          }
        }
        sumArr.push(workingArr);
      }


      let workArrLoop: any = [];
      if (sumArr.length > 1) {
        for (let i = 0; i < sumArr.length - 1; i++) {
          for (let c = 0; c < sumArr[i].length; c++) {
            if (sumArr[i][c] != 0 && sumArr[i + 1][c] != 0) {
              workArrLoop.push(sumArr[i][c])
            } else {
              if (sumArr[i][c] > sumArr[i + 1][c]) {
                workArrLoop.push(sumArr[i][c])
              } else {
                workArrLoop.push(sumArr[i + 1][c])
              }
            }
          }
        }
      } else {
        for (let i = 0; i < sumArr[0].length; i++) {
          workArrLoop.push(sumArr[0][i]);
        }
      }
      for (let work of workArrLoop) {
        datasets.data.push(work);
      }
      this.mainChart.datasets.push(datasets);
    }
  }

  getSubChart(daysofMonth: number, monthName: string, monthNum: Number, year: Number, empOperation: any) {
    this.applyMinMaxSubChart();
    this.chart = {
      labels: [],
      datasets: []
    };

    for (let i = 1; i <= daysofMonth; i++) {
      this.chart.labels.push(`${i} ${monthName} ${year}`);
    }

    const codeColor = [
      'rgba(255,167,38,0.2)',
      'rgba(255, 99, 71, 0.2)',
      'rgba(66, 165, 245, 0.2)',
      'rgba(0, 187, 126, 0.2)'

    ]

    for (let [i, emp] of empOperation.entries()) {
      let labelDate;
      let datasets: any = {
        label: '',
        data: [],
        fill: true,
        borderColor: '#FFA726',
        tension: .4,
        backgroundColor: ''
      }
      let monthLabel = ['', 'ม.ค', 'ก.พ', 'มี.ค', 'เม.ษ', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'];
      let rawStartDate = new Date(emp['startDate']);
      let rawEndDate = new Date(emp['endDate']);
      let startDate = new Date(emp['startDate']);
      let endDate = new Date(emp['endDate']);
      labelDate = `${rawStartDate.getDate()} ${monthLabel[+rawStartDate.getMonth()+1]} ${+rawStartDate.getFullYear()+543} - ${rawEndDate.getDate()} ${monthLabel[+rawEndDate.getMonth()+1]} ${+rawEndDate.getFullYear() + 543}`
      datasets.label = labelDate;
      for (let i = 1; i <= daysofMonth; i++) {
        let today = new Date(`${monthNum}/${i}/${+year-543}`);
        if (today >= startDate && today <= endDate) {
          datasets.data.push(emp.empWorking);
        } else {
          datasets.data.push(0);
        }
      }
      datasets.backgroundColor = codeColor[i];
      this.chart.datasets.push(datasets);
      console.log(this.chart)

    }
  }

  deleteItem(projRef: Number, empNo: string) {
    this.pgpoolservice.deleteOperation(projRef, empNo).subscribe({
      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'ข้อมูลที่ต้องการลบถูกลบแล้ว' });
        setTimeout(() => { window.location.reload(); }, 2000)
      }, error: () => {
        this.messageService.add({ severity: 'error', summary: 'ลบข้อมูลไม่สำเร็จ', detail: 'ข้อมูลที่ต้องการลบยังไม่ถูกลบ' });
      }
    })
  }

  applyMinMaxMainChart() {
    this.mainChartOptions = {
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 100,
        }
      }
    };
  }

  applyMinMaxSubChart() {
    this.subChartOptions = {
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 100,
        }
      }
    };
  }

  onActivate() {
    this.activate = true;
  }

  unActivate(unActivate: boolean) {
    this.activate = unActivate;
  }

}
