import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [NzBreadCrumbModule, RouterLink, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
      this.breadcrumbs = this.breadcrumbService.breadcrumbs
  }

}
