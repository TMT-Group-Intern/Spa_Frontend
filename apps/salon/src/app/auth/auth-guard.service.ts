import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private readonly tModalSvc =inject(TDSModalService)
  constructor(
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const token = getCookie('userToken')
    const userSession = localStorage.getItem('userSession');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken= localStorage.getItem('refreshToken');

    if (token && userSession != null && accessToken != null && refreshToken != null) {
      const [, payload,] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const expirationDate = new Date(decodedPayload.exp * 1000);
      if (expirationDate > new Date()) {
        return true;
      } else {
        const modal = this.tModalSvc.success({
          title:'Thông báo',
          content: `<h5 class="text-success-500">Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!</h5>`,
          footer:null,
          iconType:'tdsi-success-line',
          size:'lg',
          okText:'Xác nhận',
          onOk:()=> true
        });
        modal.afterClose.asObservable().pipe(tap(()=> this.LogOut()))
        .subscribe();
        //this.router.navigate(['']);
        return false;
      }
    } else {
      this.LogOut()
      return false;
    }
  }

  LogOut() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('appointmentDetail');
    localStorage.removeItem('customerID');
    deleteCookie('userToken')
    this.router.navigate(['']);
  };
}
// function LogOut() {
//   localStorage.removeItem('userSession');
//   localStorage.removeItem('refreshToken');
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('appointmentDetail');
//   localStorage.removeItem('customerID');
//   deleteCookie('userToken')
// };

function deleteCookie(cookieName: any) {
document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

}
function getCookie(cookieName: any) {
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
