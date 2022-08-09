import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  projectList:any = {}; 
  selectedEmployee:any;
  table:any = {};
  chart:any;

  constructor(private pgpoolservice:PGpoolService,private router:Router) { }

  ngOnInit(): void {
    const url = this.router.url.split('/');
    const id = url[url.length-1];

    
    this.pgpoolservice.getProjectById(String(id)).subscribe(response => {
    this.projectList = response;
    })

    this.pgpoolservice.getProjectEmployee(Number(id)).subscribe(response =>{
      this.table = response;
    })


    this.chart = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
      datasets: [{
          type: 'line',
          label: 'Dataset 1',
          borderColor: '#42A5F5',
          borderWidth: 2,
          fill: false,
          data: [
              50,
              25,
              12,
              48,
              56,
              76,
              42
          ]
      }, {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: '#66BB6A',
          data: [
              21,
              84,
              24,
              75,
              37,
              65,
              34
          ],
          borderColor: 'white',
          borderWidth: 2
      }, {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: '#FFA726',
          data: [
              41,
              52,
              24,
              74,
              23,
              21,
              32
          ]
      }]
  };

  }

  getEmployeeById(id:number){
    this.router.navigate(['pg-pool/employee/detail/',id])
  }

  goProjectPage(){
    this.router.navigate(['pg-pool/project/']);
  }

}
