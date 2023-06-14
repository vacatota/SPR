
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable} from 'rxjs';
import { AuthService } from '../modulos/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private usuarioService: AuthService, private router: Router) { }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const usuarioActual = this.usuarioService.getUsuarioActual;
    if (usuarioActual) {
      return true;
    }

    this.router.navigateByUrl('/login/auth');
    return false;
  }

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const usuarioActual = this.usuarioService.getUsuarioActual;
       if (usuarioActual) {      
      return true;
    }
    
    //this.router.navigateByUrl('/login');
    this.router.navigate(['/login/auth'], {queryParams: {returnUrl: state.url}});
    return false;

    // return this.usuarioService.validateTocken()
    //   .pipe(
    //     tap(isAutenticate => {
    //       isAutenticate = true;
    //       console.log("Guard: ", isAutenticate)
    //       if (!isAutenticate) {
    //         console.log("No esta loguedado, ir a login")
    //         this.router.navigateByUrl('/login');
    //       } else {
    //         console.log("Ok, verificacion correcta, tocken valido en Guard")
    //       }
    //     })
    //   );
  }

  

}
