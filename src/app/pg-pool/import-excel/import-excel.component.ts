import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { first, of } from 'rxjs';
import { PGpoolService } from 'src/app/service/pgpool.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.scss']
})
export class ImportExcelComponent implements OnInit {

  linkName!: string;
  fileName: any;
  showData: boolean = false
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  blockedImport: boolean = true;
  blockedData: boolean = true;
  rawData: any[][] = [];
  data: any = {
    person_in_charge: []
  }
  employee: any[] = []
  operation: any[] = []


  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  refresh() {
    this.ngOnInit();
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }

  onLoadExcel(fileName: any) {
    const target: DataTransfer = <DataTransfer>(fileName.target);
    const reader: FileReader = new FileReader();
    reader.onload = (event: any) => {
      const bstr: string = event.target.result;
      const workBook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const workSheetName: string = workBook.SheetNames[0];
      const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];
      this.rawData = (XLSX.utils.sheet_to_json(workSheet, { header: 1 }));
    }
    reader.readAsBinaryString(target.files[0])

    fileName = this.linkName.split("\\", 3);
    this.fileName = fileName[fileName.length - 1]
  }

  showExcelData() {
    this.showData = true
    this.blockedImport = false;

    this.rawData.map((item, index) => {
      if (item.includes('Project/Pre-Sale Code')) {
        const indexCode = item.findIndex(i => i == 'Project/Pre-Sale Code')
        const indexCustomerCode = item.findIndex(i => i == 'Customer Code')
        this.data['projCode'] = item[indexCode + 2]
        this.data['customerCode'] = item[indexCustomerCode + 2]
      }

      if (item.includes('Project Name ')) {
        const indexName = item.findIndex(i => i == 'Project Name ')
        this.data['projName'] = item[indexName + 2]
      } else if (item.includes('Project Name')) {
        const indexName = item.findIndex(i => i == 'Project Name')
        this.data['projName'] = item[indexName + 2]
      }

      if (item.includes('Contract Start Date :')) {
        const indexStartDate = item.findIndex(i => i == 'Contract Start Date :')
        const indexEndDate = item.findIndex(i => i == 'End Date :')

        this.data['projStartDate'] = item[indexStartDate + 2]
        this.data['projEndDate'] = item[indexEndDate + 2]
      }

      if (item.includes('Person in Charge')) {
        const person = this.rawData.slice(index + 3);
        person.forEach((dataArr, indexPerson) => {
          console.log(dataArr.join().includes('Programmer Specialist 1'))
          if (dataArr.includes('Programmer') || dataArr.join().includes('Programmer Specialist')) {
            this.data['person_in_charge'].push(
              {
                "Item": dataArr[0],
                "position": dataArr[1],
                "empNo": dataArr[2],
                "Name": dataArr[3],
                "startDate": dataArr[4],
                "endDate": dataArr[5],
                "empDuration": dataArr[6],
                "empWorking": dataArr[7],
                "empAssigned": dataArr[8]
              }
            )
            const nextDataArr = person.slice(indexPerson + 1);
            for (let i = 0; i < nextDataArr.length; i++) {
              if (nextDataArr[i][1] == "" || nextDataArr[i][1] == null) {
                this.data['person_in_charge'].push(
                  {
                    "Item": nextDataArr[i][0],
                    "position": nextDataArr[i][1],
                    "empNo": nextDataArr[i][2],
                    "Name": nextDataArr[i][3],
                    "startDate": nextDataArr[i][4],
                    "endDate": nextDataArr[i][5],
                    "empDuration": nextDataArr[i][6],
                    "empWorking": nextDataArr[i][7],
                    "empAssigned": nextDataArr[i][8]
                  }
                )
              } else {
                return
              }
            }
          }
        })
      }
    })
  }

  closeData() {
    this.showData = false;
    this.blockedImport = true;
  }

  getDataByExcel() {
    console.log(this.data)
    //format Data
    let person_in_charge = [...this.data.person_in_charge];
    let emp: any = {};
    person_in_charge.forEach((item, index) => {
      if (!item['empNo'] && Object.keys(emp).length > 0) {
        this.employee.push(emp);
        emp = {};
        return
      }
      const prefix = item["Name"].split(' ')[0];
      const firstName = item["Name"].split(' ')[1];
      const lastName = item["Name"].split(' ')[2];
      emp = {
        empNo: item['empNo'],
        position: item["position"],
        firstName: prefix + " " + firstName,
        lastName: lastName,
        employeeOperation: [
          {
            startDate: item["startDate"],
            endDate: item["endDate"],
            empDuration: item["empDuration"],
            empWorking: item["empWorking"],
            empAssigned: item["empAssigned"]
          }
        ]
      }
      const nextArr = person_in_charge.slice(index + 1);
      let canRun = true;
      nextArr.forEach((item) => {
        if (canRun && !item['empNo']) {
          emp.employeeOperation.push(
            {
              startDate: item["startDate"],
              endDate: item["endDate"],
              empDuration: item["empDuration"],
              empWorking: item["empWorking"],
              empAssigned: item["empAssigned"]
            }
          )
        } else {
          canRun = false;
        }
      })
    })
    //***//
    let operation: any = {};
    let projectList: any = {};
    let projCode = this.data['projCode'];

    this.pgpoolservice.addProject(this.data).subscribe({
      complete: () => {
        this.pgpoolservice.getProjectByProjCode(projCode).subscribe(response => {
          projectList = response;

          this.employee.forEach(item => {
            operation = {
              project: { projRef: projectList[0]['projRef'] },
              employee: { empNo: item['empNo'] }
            }
            this.operation.push(operation)
          })

          this.operation.forEach((item, index) => {
            this.pgpoolservice.addOperation(item).subscribe((res: any) => {
              console.log(res.opId);
              for (let empOp of this.employee[index].employeeOperation) {
                empOp['operation'] = {opId: res.opId}
                this.pgpoolservice.addEmpOperation(empOp).subscribe(res =>{
                })
              }
            })
          })
        })
        this.postEmployee();
      }, error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Employee create error', life: 3000 });
      }
    });
    this.showData = false;
    this.closeImport();
  }

  postEmployee() {
    this.employee.forEach(item => {
      this.pgpoolservice.addEmployee(item).subscribe({
        complete: () => {
        }, error: (e) => {
        }
      });
    });
  }

}


