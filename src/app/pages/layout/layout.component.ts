import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { tokenUtil } from '../../utils/token/token';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    RouterLink,
    CommonModule,
    BreadcrumbComponent,
    RouterModule,
    NzAvatarModule,
    NzDropDownModule,
    
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  roles: string = "";
  email: string | null = null;
  currentUrl: string = "";

  isCollapsed = false;
  isAdmin = false;
  isUser = false;
  isLoggedIn = false;


  constructor(private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    })

    // this.getRole();
    // this.getEmail();


    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = ''; 
      user?.roles.map((r: { authority: string; }) => {
        this.roles += r.authority;
      });

      this.isUser = this.roles.includes('USER');
      this.isAdmin = this.roles.includes('ADMIN');

      this.email = user?.name

    }
  }


  logout(): void {
    // tokenUtil.removeToken();

    this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean()
        
      },
      error: err => {
        console.error('Error:', err);
      }
    })
    this.router.navigateByUrl('/login');
  }

  login(): void {
    this.router.navigateByUrl('/login');
  }

  // getRole(): void {
  //   this.roles = tokenUtil.getRoles(tokenUtil.getToken())
    
  //   if (this.roles.includes("ADMIN")) {
  //     this.isAdmin = true;
  //   } else if (this.roles.includes("USER")) {
  //     this.isUser = true;
  //   }
  // }

  // getEmail(): void {
  //   this.email = tokenUtil.getUserName(tokenUtil.getToken())
  // }



}
