import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DepartmentsService } from '../../services/department/departments.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormControl, FormGroup } from '@angular/forms';

interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  managerId: number;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [NzTableModule, CommonModule, NzButtonModule, NzIconModule, NzFlexModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  Department: Department[] = [];
  depService: DepartmentsService = new DepartmentsService();
  currentDep: Department | undefined = undefined;

  isVisible = false;

  depForm: FormGroup<{
    departmentName: FormControl<string>;
    description: FormControl<string>;
    managerId: FormControl<number>;
  }>;

  listOfManagers: any[] = [
    {
      id: 1,
      name: 'IT',
    },
    {
      id: 2,
      name: 'HR',
    },
    {
      id: 3,
      name: 'Finance',
    },
  ];
  
  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.depService.getAll().subscribe(deps => this.Department = deps)
  }
}
