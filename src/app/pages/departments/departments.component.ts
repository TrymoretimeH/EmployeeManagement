import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DepartmentsService } from '../../services/department/departments.service';

interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  managerId: number;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [NzTableModule, CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  Department: Department[] = [];
  depService: DepartmentsService = new DepartmentsService();
  
  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.depService.getAll().subscribe(deps => this.Department = deps)
  }
}
