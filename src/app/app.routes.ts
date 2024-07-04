import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { authGuard } from './guard/auth.guard';

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
        path: '',
        component: LayoutComponent,
        data: { breadcrumb: 'Layout' },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: { breadcrumb: 'Dashboard' },
                canActivate: [authGuard]
            },
            {
                path: 'employees',
                component: EmployeesComponent,
                data: { breadcrumb: 'Employee' },
                canActivate: [authGuard]
            },
            {
                path: 'departments',
                component: DepartmentsComponent,
                data: { breadcrumb: 'Department' },
                canActivate: [authGuard]
            }
        ]
    }
];
