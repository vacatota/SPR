
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../modulos/auth/services/auth.service';
import { Router } from '@angular/router';
import { NO_API_KEY, skipApiKey } from './http.context';

export const BYPASS_JWT_TOKEN = new HttpContextToken(() => false);

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, 
                private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authenticationService.getUsuarioActual;
        if (currentUser && currentUser.token) {          
            if (request.context.get(BYPASS_JWT_TOKEN) === true) {          
               // Here we can find out if the Http Call triggered wanted to skip the interceptor or not
                if (request.context.get(NO_API_KEY)) {               
                    // if enters it's because skipApiKey function was called for this request. Won't add the token
                    return next.handle(request);
                }                   
                return next.handle(request);
            }

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.authenticationService.logout();
                    this.router.navigateByUrl('/login/auth');
                }    

                //console.log('Jwt_interceptor: ',err );
                if(err.status === 400){
                    console.log('Error 400: ', err.error.detail );
                }
                //return throwError(() => new Error(err.message))
                return throwError(err)
            })
        );
    }


}




