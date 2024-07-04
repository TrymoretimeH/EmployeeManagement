import { ApplicationRef, ChangeDetectorRef, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  UrlSegment,
} from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ApplicationRef
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((value: any) => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        this.cdr.tick();
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): Array<{ label: string; url: string }> {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {

      return breadcrumbs;
    }

    for (const child of children) {
      const routeArrUrl: UrlSegment[] = child.snapshot.url;

      const routeUrl: string = routeArrUrl
        .map((segment) => segment.path)
        .join('/');

      if (routeUrl !== '') {
        url += `/${routeUrl}`;
      }
      if (url !== '') {
        breadcrumbs.push({
          label: child.snapshot.data['breadcrumb'],
          url: url,
        });
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
