import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menus: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.menus = [
      {
        label: 'Tablero',
        items: [
          {
            label: 'Escritorio',
            icon: 'fe-airplay',
            routerLink: ['/pages/dashboard'],
          },
        ],
      },

      {
        label: 'Administración sistema',
        items: [
          {
            label: 'Administración',
            name: 'cat1',
            icon: 'fe-grid',
            routerLink: ['#'],
            items: [
              { label: 'Ambientes', routerLink: ['catalogos-proces/ambientes'] },
              {
                label: 'Subsistemas',
                routerLink: ['catalogos-proces/subsistemas'],
              },
              { label: 'Usuarios', routerLink: 'admin/usuarios' },
            ],
          },
          {
            label: 'Catálogos',
            name: 'cat',
            icon: 'fe-book-open',
            routerLink: ['#'],
            items: [
              { label: 'Permisos', routerLink: 'admin/permisos' },
              { label: 'Roles', routerLink: ['admin/roles'] },
            ],
          },
        ],
      },

      {
        label: 'Administración procesos',
        items: [
          {
            label: 'Administración', name: 'lin1', icon: 'fe-grid', routerLink: ['#'], items: [
              { label: 'Ambientes', routerLink: ['catalogos-proces/ambientes'] },
              { label: 'Usuarios', routerLink: 'admin/usuarios' },
            ],

          },
          {
            label: 'Catálogos',
            name: 'lin2',
            icon: 'fe-book-open',
            routerLink: ['#'],
            items: [
              { label: 'Umbrales', routerLink: ['catalogos-proces/umbrales'] },
              {
                label: 'Subsistemas',
                routerLink: 'catalogos-proces/subsistemas',
              },
              { label: 'Comunes', routerLink: 'catalogos-proces/comunes' },
              { label: 'Especial uno', routerLink: 'catalogos-proces/especialuno' },
              { label: 'Especial dos', routerLink: 'catalogos-proces/especialdos' },
            ],
          },
          {
            label: 'Gestión planes', name: 'lin8', icon: 'fe-book-open', routerLink: ['#'], items: [
              { label: 'Plan institucional', routerLink: ['catalogos-admin/plan-institucional'] },
              { label: 'Gestión plan-años', routerLink: 'catalogos-admin/plan-anios' },
              { label: 'Equipo gerencial', routerLink: ['catalogos-admin/equipo-gerencial'] },
              { label: 'Visión', routerLink: 'catalogos/usuarios' },
             // { label: 'Visión', routerLink: 'catalogos/usuarios' },
            ],
          },
        ]
      },
      {
        label: 'Formulación',
        items: [
          {
            label: 'Ambientes', name: 'lin3', icon: 'fe-grid', routerLink: ['#'], items: [

              { label: 'Gestión Areas', routerLink: ['catalogos-admin/areas'] },
            ],

          },
          {
            label: 'Planes',
            name: 'lin4',
            icon: 'fe-book-open',
            routerLink: ['#'],
            items: [
              { label: 'Visión', routerLink: 'elementos-plan/vision' },
              { label: 'Atribuciones', routerLink: 'elementos-plan/atribucion' },
              { label: 'Objetivos', routerLink: 'elementos-plan/objetivos' },
              { label: 'Estrategias', routerLink: 'elementos-plan/estrategias' },
              { label: 'Lineas acción', routerLink: 'elementos-plan/linea-accion' },
              { label: 'Planes acción', routerLink: 'elementos-plan/plan-accion' },
              { label: 'Proyectos', routerLink: 'elementos-plan/proyectos' },
              { label: 'Procesos', routerLink: 'elementos-plan/procesos' },
              { label: 'Indicadores', routerLink: 'elementos-plan/indicadores' },
              { label: 'Riesgos', routerLink: 'elementos-plan/riesgos' },
              {
                label: 'Servcicios informativos',
                routerLink: 'elementos-plan/servicios',
              },
            ],
          },
        ],
      },
    ];
  }
}
