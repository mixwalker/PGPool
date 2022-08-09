import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { PGpoolService } from 'src/app/service/pgpool.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [MessageService]
})
export class ProjectComponent implements OnInit {

  items!: MenuItem[];

  projectList:any = [];
  selectedProject:any;
  activate:boolean = false;
  cdgPic:string = "assets/picture/cdg.png";
  constructor(private pgpoolservice:PGpoolService,private router:Router,private messageService: MessageService) { 
  }

  ngOnInit(): void {
    this.pgpoolservice.getAllProject().subscribe(response => {
      this.projectList = response
    })
  }

  getProjectById(id:number){
    this.router.navigate(['pg-pool/project/detail/',id]);
  }

  onActivate(){
    this.activate = true;
  }

  unActivate(unActivate:boolean){
    this.activate = unActivate;
  }

  
}
