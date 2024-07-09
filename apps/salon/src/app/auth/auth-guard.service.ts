import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
//import { AuthService } from 'apps/salon/src/app/login/login.component'; // Giả sử bạn có một service xử lý việc đăng nhập

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    // Kiểm tra xem có token trong localStorage hay không
    if (
      //localStorage.getItem('userToken')
      getCookie('userCookie')
    ) {
      //console.log(getCookie('userCookie'))
      return true;
    } else {
      // Chuyển hướng người dùng đến trang đăng nhập
      this.router.navigate(['']);
      return false;
    }
  }
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
