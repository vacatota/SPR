import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { CatalogosProcesModule } from './modulos/catalogos-proces/catalogos-proces.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AdminModule } from './modulos/admin/admin.module';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { ElementosPlanModule } from './modulos/elementos-plan/elementos-plan.module';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';
import { CatalogosAdminModule } from './modulos/catalogos-admin/catalogos-admin.module';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    
    LayoutModule,
    SpinnerModule,
    CatalogosProcesModule,
    ElementosPlanModule,
    CatalogosAdminModule,
    HttpClientModule,

    AdminModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),

  ],
  providers: [
   {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
