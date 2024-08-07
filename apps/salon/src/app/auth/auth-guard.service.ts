import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private readonly tModalSvc = inject(TDSModalService);

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const token = this.getCookie('userToken');
    const userSession = localStorage.getItem('userSession');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && userSession != null && accessToken != null && refreshToken != null) {
      if (token.split('.').length === 3) {
        try {
          const [, payload,] = token.split('.');
          const decodedPayload = this.decodeJWTPayload(payload);
          const expirationDate = new Date(decodedPayload.exp * 1000);
          if (expirationDate > new Date()) {
            return true;
          } else {
            const modal = this.tModalSvc.success({
              title: 'Thông báo',
              content: `<h5 class="text-success-500">Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!</h5>`,
              footer: null,
              iconType: 'tdsi-success-line',
              size: 'lg',
              okText: 'Xác nhận',
              onOk: () => true,
            });
            modal.afterClose.asObservable().pipe(tap(() => this.LogOut())).subscribe();
            return false;
          }
        } catch (error) {
          this.LogOut();
          return false;
        }
      } else {
        this.LogOut();
        return false;
      }
    } else {
      this.LogOut();
      return false;
    }
  }

  LogOut() {
    // ... (your logout logic)
  }

  private decodeJWTPayload(base64Payload: string): any {
    try {
      const base64 = base64Payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Array.prototype.map.call(atob(base64), (c) => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT payload:', error);
      throw error;
    }
  }

  private getCookie(cookieName: string): string {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
}

