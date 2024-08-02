import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, debounceTime, filter, Observable, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private storageService: StorageService,
        private authService: AuthService,
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ withCredentials: true });
    return next.handle(req).pipe(
        catchError((error) => {
            if (
                error instanceof HttpErrorResponse &&
                !(req.url.includes('auth/signin') || req.url.includes('auth/refreshtoken')) &&
                error.status === 403
            ) {
                return this.handle403Error(error, req, next);
            }

            return throwError(() => error);
        })
    );
  }

  private handle403Error(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        if (this.storageService.isLoggedIn()) {
            return this.authService.refreshToken().pipe(
                switchMap((ok) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(ok);
                    return next.handle(req);
                }),
                catchError((err) => {
                    this.isRefreshing = false;
                    if (err.status == '400') {
                        this.storageService.clean();
                    }
                    return throwError(() => err);
                })
            );
        }
    }
    return this.refreshTokenSubject.pipe(
        filter(ok => ok != null),
        take(1),
        switchMap(token => {
            return next.handle(req);
        })
    );
  }

}