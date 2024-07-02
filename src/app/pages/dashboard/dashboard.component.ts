import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NzTableModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  listOfData: ItemData[] = [];
  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London`
      });
    }
  }
}
