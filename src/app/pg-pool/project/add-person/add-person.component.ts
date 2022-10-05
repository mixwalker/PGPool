import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {

  @Input() opList: any = {};
  @Output() unBlock = new EventEmitter;
  @Output() refreshAndMessage = new EventEmitter;
  blockedImport: boolean = true;
  activateAddOperation: boolean = false;
  employeeList: any[] = [];
  employee:any = {};

  constructor(private pgpoolservice: PGpoolService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.pgpoolservice.getAllEmplyoee().subscribe({
      next: (res: any) => {
        this.employeeList = res
      },
      complete: () => {
        for (let op of this.opList) {
          const index = this.employeeList.map(obj => obj.empNo).indexOf(op.employee.empNo);
          if (index != -1) {
            this.employeeList.splice(index, 1);
          }
        }
      }
    });
    console.log(this.opList)
  }

  inputSearch(inputEL: any, event: any) {
    inputEL.filterGlobal(event.target.value, 'contains')
  }

  onActivateAddOperation(employeeList:any) {
    this.activateAddOperation = true;
    this.employee = employeeList;
  }

  unActivateAddOperation(unActivate: boolean) {
    this.activateAddOperation = unActivate;
  }

  closeImport() {
    this.blockedImport = false;
    this.unBlock.emit(this.blockedImport)
  }
}
