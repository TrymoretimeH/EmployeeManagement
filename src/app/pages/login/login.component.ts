import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
      console.log(res);
      if (res.isSuccess) {
        localStorage.setItem("token", res.data.token);
        this.router.navigateByUrl("employees")
      }
    })
  }

}


