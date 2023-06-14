import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertService } from "../../../../services/alert.service";
import { IpPublicService } from 'src/app/services/ip-public.service';
import { ModalService } from 'src/app/services/modal.service';
import { TreeNode } from "primeng/api";
import { UnidadesSiipneService } from 'src/app/services/unidades-siipne.service';
import { ComunService } from '../../services/comun.service';
import { SubsistemaService } from '../../services/subsistema.service';
import { AmbienteService } from 'src/app/modulos/catalogos-admin/services/ambiente.service';

@Component({
  selector: 'app-ambientes',
  templateUrl: './ambiente.component.html'
})
export class AmbienteComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Sistema'}, {label: 'Administración'}, {label: 'Ambientes', active: true}];

  formAmbiente: FormGroup;
  ipAddress!: string;
  submitted: boolean = false;
  ambientes: any[] = [];
  subsistemas: any[] = [];
  niveles: any[] = [];
  selectItems: any[] = [];
  idSprAmbienteEliminar: number = 0;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  unidades: TreeNode[];
  selectedFile: TreeNode;

  currentUser!: any;

  showConfirm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ambienteService: AmbienteService,
    private unidadesSiipneService: UnidadesSiipneService,
    private comunService: ComunService,
    private subsistemaService: SubsistemaService,
    private alertService: AlertService,
    private ip: IpPublicService,
    public modal: ModalService
  ) {
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
  }

  get ambFrm() {
    return this.formAmbiente.controls;
  }

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(user);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
      }
    };

    this.getTreeUnidadesSiipne();

    this.initForm();

    this.getData();
    this.getCatalogos();
  }

  getCatalogos() {
    this.ambienteService.list().subscribe(resp => {
      this.ambientes = resp;
    });

    this.comunService.list(`?spr_idSprComun=${212}`).subscribe(resp => {
      this.niveles = resp;
    });

    this.subsistemaService.list().subscribe(resp => this.subsistemas = resp);

    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getTreeUnidadesSiipne() {
    this.unidadesSiipneService.listParents().subscribe((resp: TreeNode[]) => {
      this.unidades = resp;
      this.unidades.forEach(node => {
        this.unidadesSiipneService.listChilds(node.data).subscribe((respChild: TreeNode[]) => {
          node.children = respChild;
        });
      });
    });
  }

  initForm() {
    this.formAmbiente = this.fb.group({
      idSprAmbiente: [],
      spr_idSprAmbiente: [],
      idDgpUnidad: ['', [Validators.required]],
      idSprNivel: ['', [Validators.required]],
      idSprSubsistema: [''],
      nombreUnidad: ['', [Validators.required]],
      nombreCorto: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });

    this.formAmbiente.patchValue({
      estado: this.selectItems[0].value,
    });
  }

  reDrawDataTable() {
    // Redibujar la tabla al actualizar datos
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next(null);
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  openModal() {
    this.submitted = false;
    this.selectedFile = null;
    this.collapseAll();
    this.formAmbiente.reset();
    this.modal.open('new');
  }

  edit(obj: any) {
    this.openModal();
    this.formAmbiente.patchValue({
      idSprAmbiente: obj.idSprAmbiente,
      spr_idSprAmbiente: obj.spr_idSprAmbiente,
      idDgpUnidad: obj.idDgpUnidad,
      idSprNivel: obj.idSprNivel,
      idSprSubsistema: obj.idSprSubsistema,
      nombreUnidad: obj.nombreUnidad,
      nombreCorto: obj.nombreCorto,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      estado: obj.estado
    });
  }

  delete(id: number) {    
    this.idSprAmbienteEliminar = id;
    this.modal.open('del');
  }

  confirmDelete() {
    if (this.idSprAmbienteEliminar > 0) {
      this.ambienteService.update({
        "idSprAmbiente": this.idSprAmbienteEliminar,
        "usuario": this.currentUser.idSprUsuario,
        "delLog": "S",
        "ip": this.ipAddress
      }).subscribe(resp => {
        this.getData();
        this.alertService.deleteOk();
        this.modal.close();
      }, (err) => {
        this.alertService.deleteError();
        this.modal.close();
      });
    }
  }

  showEliminar(id: number) {
    console.log(this.showConfirm);
    this.showConfirm = true;
    this.idSprAmbienteEliminar = id;

  }

  // delete(value: boolean) {
  //   this.showConfirm = false;
  //   if (value) {
  //     this.ambienteService.update({
  //       "idSprAmbiente": this.idSprAmbienteEliminar,
  //       "usuario": this.currentUser.idSprUsuario,
  //       "delLog": "S",
  //       "ip": this.ipAddress
  //     }).subscribe(resp => {
  //       this.getData();
  //       this.alertService.deleteOk();
  //       this.modal.close();
  //     }, (err) => {
  //       this.alertService.deleteError();
  //       this.modal.close();
  //     });
  //   } else {
  //     this.alertService.alert('Cancelado', 'Eliminación cancelada', 'info' );
  //   }
  // }


  onSubmit() {
    this.submitted = true;

    if (this.formAmbiente.invalid) {
      return;
    }

    if (this.formAmbiente.value.fechaInicio > this.formAmbiente.value.fechaFin) {
      this.alertService.warning('¡Advertencia!', 'Fecha de inicio no puede ser mayor a la fecha fin.');
      return;
    }

    if (this.formAmbiente.value.idSprAmbiente === null) {
      //nuevo registro
      this.ambienteService.create(this.formAmbiente.value).subscribe(resp => {
        this.modal.close();
        this.getData();
        this.ambienteService.list().subscribe(resp => {
          this.ambientes = resp;
        });
        this.alertService.createOk();
      }, (err) => {
        this.alertService.createError();
      });
    } else {
      //editar registro
      this.ambienteService.update(this.formAmbiente.value).subscribe(resp => {
        this.modal.close();
        this.getData();
        this.ambienteService.list().subscribe(resp => {
          this.ambientes = resp;
        });
        this.alertService.updateOk();
      }, (err) => {
        this.alertService.updateError();
      });
    }
  }

  getData() {
    this.ambienteService.list().subscribe(resp => {
      this.ambientes = resp;
      // this.dtTrigger.next(null);
      this.reDrawDataTable();
    });
  }

  nodeSelect(evt) {
    this.formAmbiente.patchValue({
      idDgpUnidad: evt.node.data,
      nombreUnidad: evt.node.label
    });
  }

  nodeExpand(event) {
    if (event.node) {
      this.unidadesSiipneService.listChilds(event.node.data).subscribe(resp => {
        event.node.children = resp;
      });
    }
  }

  private collapseAll() {
    this.unidades.forEach((node) => {
      this.expandRecursive(node, false);
    })
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      })
    }
  }
}
