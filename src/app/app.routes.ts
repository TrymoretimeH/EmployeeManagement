import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { authGuard } from './guard/auth/auth.guard';
import { SalarysComponent } from './pages/salarys/salarys.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { adminGuard } from './guard/admin/admin.guard';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';

import { DefaultLayoutComponent } from './layout'

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: RegisterComponent
    },  
    {
        path: '',
        component: DefaultLayoutComponent,
        data: { 
            title: 'Home',
            breadcrumb: 'Layout' },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: { breadcrumb: 'Dashboard' },
            },
            {
                path: 'users',
                component: UsersComponent,
                data: { breadcrumb: 'User' },
                canActivate: [authGuard, adminGuard]
            },
            {
                path: 'employees',
                component: EmployeesComponent,
                data: { breadcrumb: 'Employee' },
                canActivate: [authGuard, adminGuard]
            },
            {
                path: 'departments',
                component: DepartmentsComponent,
                data: { breadcrumb: 'Department' },
                canActivate: [authGuard, adminGuard]
            },
            {
                path: 'salarys',
                component: SalarysComponent,
                data: { breadcrumb: 'Salary' },
                canActivate: [authGuard, adminGuard]
            },
            {
                path: 'attendances',
                component: AttendanceComponent,
                data: { breadcrumb: 'Attendance' },
                canActivate: [authGuard]
            }
        ]
    }
];
