import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  isLoggedIn = false;
  
  registerObj: any = {
    "name": "",
    "password": "",
    "email": "",
    "roles": "USER",
    "confirm_password": ""
  };

  http = inject(HttpClient);

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }

    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  onRegister() {
    const { name, password, email, roles, confirm_password } = this.registerObj;

    if (password !== confirm_password) {
      console.error('Password and confirm password do not match');
      return;
    } else {
      this.authService.signup(name, password, email, roles).subscribe({
        next: data => {
          this.storageService.saveUser(data);
          this.isLoggedIn = true;
          // this.roles = this.storageService.getUser()?.roles;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          console.error('Error:', err);
        }
      })
    }


  }

  reloadPage(): void {
    window.location.reload();
  }

}


