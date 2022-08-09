import { Component, Input, OnInit } from '@angular/core';
import { PGpoolService } from '../service/pgpool.service';

@Component({
  selector: 'app-pg-pool',
  templateUrl: './pg-pool.component.html',
  styleUrls: ['./pg-pool.component.scss'],
})
export class PgPoolComponent implements OnInit {

  constructor(private pgpoolservice:PGpoolService,) { 
  }

  ngOnInit(): void {
  }

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getPgpoolClass():string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed';
    }else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }

}
