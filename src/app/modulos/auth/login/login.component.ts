
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {AlertService } from './../../../services/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
  ]
})
export class LoginComponent implements OnInit {
  public mostrarLoad: boolean = false;
  public formSubmitted = false;
  public formLogin!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: AuthService,
    private alert:AlertService) {
    this.formLogin = this.fb.group({
      nombreUsuario: ['cova1716323173', [Validators.required]],
      claveUsuario: ['Julvam802808#', [Validators.required]],
    });
  }
  ngOnInit(): void {
  }

  onSubmit() {
    this.load(true);
    this.formSubmitted = true;
    if (this.formLogin.invalid) {
      return
    }

    this.loginService.auth(this.formLogin.value)
      .subscribe(response => {

        if (response['access_token']) {
          var url = "http://localhost:4200/pages/dashboard";
          window.location.href = url;
          //this.router.navigate(['pages/dashboard']);
          //this.router.navigateByUrl('/pages/dashboard');
          //this.alert.alert("Bienvenido al SPR policial", "Correcto!", "info")
        }
      },
        err => {
          this.alert.alert("Usuario o clave incorrecto", "Ups!", "warnnig");
          this.router.navigateByUrl('login/auth');
        });


  }

  load(state: boolean) {
    return this.mostrarLoad = state;
  }
}
