import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginObj: any = {
    "EmailId": "",
    "Password": "",
  };

  http = inject(HttpClient);

  onLogin() {
    // this.http.post("https://freeapi.miniprojectideas.com/api/User/Login", this.loginObj).subscribe((res: any) => {
    //   if (res.result) {
    //     alert("Login success!")
    //   } else {
    //     alert("Check email or password")
    //   }
    // })
  }

}


