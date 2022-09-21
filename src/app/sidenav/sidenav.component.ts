import { Component, Output,EventEmitter, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoginService } from '../service/login.service';
import { navbarData } from './nav-data';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  
  displaysLogout:boolean = false;
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  cdgPic:string = "assets/picture/cdg.png";

  constructor(private loginService:LoginService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    if (localStorage.getItem("pg-pool") !== null) {
      this.displaysLogout = true;
    }
  }

  toggleCollapse():void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth})
  }

  closeSidenav():void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth})
  }

  logout(){
    this.loginService.logout();
    window.location.href = "pg-pool/login";
  }

}
