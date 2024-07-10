import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginObj: any = {
    "email": "",
    "password": "",
  };

  http = inject(HttpClient);

  constructor(private router: Router) {}

  onLogin() {
    this.http.post("http://localhost:8094/auth/generateToken", this.loginObj, {
      headers: {
        "Content-Type": "application/json"
      }
    
    }).subscribe((res: any) => {
      if (res.isSuccess) {
        
        tokenUtil.setToken(res.data.token);
        // localStorage.setItem("token", res.data.token);
        this.router.navigateByUrl("employees")
      }
    })
  }

}


