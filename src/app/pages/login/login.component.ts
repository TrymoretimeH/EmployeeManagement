import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NzIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  roles = [];
  
  loginObj: any = {
    "email": "",
    "password": "",
  };

  http = inject(HttpClient);

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser()?.roles;
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    const { email, password } = this.loginObj;

    this.authService.login(email, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser()?.roles;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        alert('Login failed');
        console.error('Error:', err);
      }
    })
  }

  goSignupPage(): void {
    this.router.navigate(['/signup']);
  }

  reloadPage(): void {
    window.location.reload();
  }

}


