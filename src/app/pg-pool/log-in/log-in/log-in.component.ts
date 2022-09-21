import { Component, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  username:string = "";
  password:string = "";
  constructor(private loginService:LoginService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.loginService.isLoggedIn$.subscribe(res => {
      if (res) {
        window.location.href = "pg-pool/project"
      }
    })
  }

  login(){
    this.loginService.login(this.username,this.password).subscribe({
      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'เข้าสู่ระบบสำเร็จ', detail: 'เข้าสู่ระบบเรียบร้อยแล้ว' });
      }, error: () => {
        this.messageService.add({ severity: 'error', summary: 'เข้าสู่ระบบไม่สำเร็จ', detail: 'ชื่อผู้ใช้งานหรือรหัสผ่านผิด' });
      }
    })
  }

}
