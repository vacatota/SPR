import { EstrategiasService } from '../../services/estrategias.service';
import { ObjetivoService } from '../../services/objetivo.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject,mergeMap } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { EstrategiaObjetivoService } from '../../services/estrategia-objetivo.service';

@Component({
  selector: 'app-estrategias',
  templateUrl: './estrategias.component.html',
  styleUrls: ['./estrategias.component.css']

})
export class EstrategiasComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{label: 'Formulación'}, {label: 'Planes'}, {label: 'Estratégias', active: true}];
  public formEstrategias!: FormGroup;
  public submitted = false;
  public dataEstrategia: any[] = [];
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  public nameApp = 'Estrategias';
  public formSubmitted = false;
  public nombreUnidad: any;
  public currentAmbiente: any
  public idSprAmbiente: any;
  public formObjetivoActual!: FormGroup;
  public formObjetivoActual1!: FormGroup;
  public formSelectCatalogo!: FormGroup;
  public dataObjetivo!: any;
  public dataEstrategiaObjetivo!: any;
  public dataEstrategiasMain!: any;
  public mostrarModalDetalle: boolean = false;
  public mostrarModal: boolean = false;
  public nameObjetivoDetalle!: string;
  public desripcionEstrategia!: any;
  currentUser!: any;
  ipAddress: any;
  buffer!: any;
  private idDeleteRegister: number = 0;
  private idDeleteRegister1: number = 0;
  private idSprEstrategiaObjetivo:number = 0;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private estrategiasService: EstrategiasService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    private estrategiaObjetivoService:EstrategiaObjetivoService,
    private objetivoService: ObjetivoService,
  ) {
    this.getDataObjetivo(this.idSprAmbiente);
    this.buffer = localStorage.getItem('currentUser');
    this.currentAmbiente = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentAmbiente.nombreUnidad;
    this.currentUser = JSON.parse(this.buffer);
    this.idSprAmbiente = this.currentUser.idSprAmbiente;
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];


    this.formEstrategias = this.fb.group({
      idSprEstrategia: ["",[]],
      idSprObjetivo: ["",[]],
      nombre: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      nivelActual: [],

    });

    this.formSelectCatalogo = this.fb.group({
      spr_idSprEstrategia: [0],
    });

  }

  get EstrategiasForm() {
    return this.formEstrategias.controls;
  }

  setDataTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
      },
    };
  }

  setForm() {
    this.formEstrategias = this.fb.group({
      idSprEstrategia: [],
      idSprObjetivo: [],
      nombre: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formEstrategias.patchValue({
      estado: this.selectItems[0].value,
    });
  }

  initApp() {
    this.setForm();
    //this.getDataObjetivo(this.idSprAmbiente)
    this.setDataTable();

  this.listEstrategia(this.idSprAmbiente);

  }
  ngOnInit(): void {
    this.getIpPublic();

    this.initApp();
  }
  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listEstrategia(idSprAmbiente: any) {
    this.estrategiasService.list().subscribe((resp) => {
      this.dataEstrategia = resp;
      console.log("1. Estrategias: ", this.dataEstrategia)
      this.getDataObjetivo(this.idSprAmbiente);
    });
  }

  getDataObjetivo(idSprAmbiente: number) {
    this.objetivoService.list('?idSprAmbiente=' + idSprAmbiente)
      .subscribe(respuestaService => {
        this.dataObjetivo = respuestaService;
        console.log("2. Objetivos: ", this.dataObjetivo)
        this.getDataEstrategiaObjetivo();
      })
  }


  getDataEstrategiaObjetivo() {
    this.estrategiaObjetivoService.list()
      .subscribe((resp) => {
        this.dataEstrategiaObjetivo = resp;
        console.log('3. Estrategia-objetivo: ', this.dataEstrategiaObjetivo);
       // this.listEstrategia(this.idSprAmbiente);
       this.mapeoEstrategiaObjetivo();

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

  onSubmit() {
    this.formEstrategias.value.usuario = this.currentAmbiente.idSprUsuario;
    this.formEstrategias.value.ip = this.ipAddress;
    this.formEstrategias.value.nombre = this.formEstrategias.value.nombre.toUpperCase();
    this.formEstrategias.value.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    this.submitted = true;
    if (!this.formEstrategias.invalid) {
      if (this.formEstrategias.value.idSprEstrategia == null) {
        this.formEstrategias.value.delLog = 'N';
        let estrategia = {
          nombre: this.formEstrategias.value.nombre,
          estado: this.formEstrategias.value.estado,
          ip: this.ipAddress,
          usuario: this.currentAmbiente.idSprUsuario,

        }

         this.objetivoService.list();
         let idSprEstrategiault: any;

          this.estrategiasService.create(estrategia).pipe(
           mergeMap((estrategiaGuardada) => {
             idSprEstrategiault = estrategiaGuardada.idSprEstrategia
             this.formEstrategias.value.nivelSuperior = 'N'
             this.formEstrategias.value.idSprEstrategia = estrategiaGuardada.idSprEstrategia
             console.log('data get....', this.formEstrategias.value);
             return this.estrategiaObjetivoService.create(this.formEstrategias.value)
        }))
          .subscribe(data => {
          this.listEstrategia(this.idSprAmbiente);
          this.getDataObjetivo(this.idSprAmbiente);
          this.getDataEstrategiaObjetivo();
          this.modal.close();
          this.alert.createOk();
        }, (err) => {
          this.alert.createError();
          let estra = {
            idSprEstrategia: idSprEstrategiault,
            delLog: "S",
          }
          this.estrategiasService.update(estra).subscribe();
          this.modal.close();
        });
      } else {
        let estrategia = {
          idSprEstrategia: this.formEstrategias.value.idSprEstrategia,
          nombre: this.formEstrategias.value.nombre,
          estado: this.formEstrategias.value.estado,
          ip: this.ipAddress,
          usuario: this.currentAmbiente.idSprUsuario,
        }

        this.estrategiasService.update(estrategia).pipe(
          mergeMap((estrategiaGuardada) => {            
            this.formEstrategias.value.nivelSuperior = 'N';
            this.formEstrategias.value.idSprEstrategia = estrategiaGuardada.idSprEstrategia;
            this.formEstrategias.value.idSprEstrategiaObjetivo = this.idSprEstrategiaObjetivo;
            return this.estrategiaObjetivoService.update(this.formEstrategias.value)
       })).subscribe(data => {

         this.listEstrategia(this.idSprAmbiente);
         this.modal.close();
         this.alert.updateOk();
       });








/*
        const dataEstrategias = this.estrategiasService.update(estrategia)
        console.log('data estrategia....', this.formEstrategias.value);


        dataEstrategias.pipe(
          mergeMap((estrategiaGuardada) => {

            this.formEstrategias.value.nivelSuperior = 'N'
            return this.estrategiaObjetivoService.update(this.formEstrategias.value)
          })
        )
          .subscribe(resp => {
            this.listEstrategia(this.idSprAmbiente);
            this.getDataObjetivo(this.idSprAmbiente);
            this.getDataEstrategiaObjetivo();
            this.modal.close();
            this.alert.updateOk();
          }, (err) => {
            this.alert.updateError();
          });

*/
      } // Else update
    } else {
      return;
    }
  }

  edit(obj: any){
    console.log('Editando: ', obj);
    this.idSprEstrategiaObjetivo = obj.idSprEstrategiaObjetivo,

    this.openModal();
    this.formEstrategias.patchValue({
      idSprEstrategia: obj.idSprEstrategia,
      idSprObjetivo: obj.idSprObjetivo,
      idSprAmbiente: obj.idSprAmbiente,
      nombre: obj.nombre,
      estado: obj.estado,
    });
  }

  delete(row: number) {

    this.modal.open('delete');
    this.idDeleteRegister = row;
    this.idDeleteRegister1 = row;
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      let estrategiaObjetivo = {
        idSprEstrategiaObjetivo: this.idDeleteRegister,
        usuario: this.currentAmbiente.idSprUsuario,
        ip: this.ipAddress,
        delLog: "S",
      }
      let estrategia = {
        idSprEstrategia: this.idDeleteRegister1,
        usuario: this.currentAmbiente.idSprUsuario,
        ip: this.ipAddress,
        delLog: "S",
      }

      const dataEstrategias = this.estrategiaObjetivoService.update(estrategiaObjetivo)
      dataEstrategias.pipe(
        mergeMap((estrategiaGuardada) => {
          return this.estrategiasService.update(estrategia)
        })
      )
        .subscribe(resp => {
          this.listEstrategia(this.idSprAmbiente);
          this.getDataObjetivo(this.idSprAmbiente);
          this.getDataEstrategiaObjetivo();
          this.alert.deleteOk();
        }, (err) => {
          this.alert.deleteError()
        })
    }
  }


  mapeoEstrategiaObjetivo() {
    let dataProcess: any = [];
    for (let i = 0; i < this.dataObjetivo.length; i++) {
      for (let j = 0; j < this.dataEstrategiaObjetivo.length; j++) {
        if ((this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiaObjetivo[j].idSprObjetivo) && (this.dataEstrategiaObjetivo[j].nivelSuperior == 'N')
        ) {


          for (let k = 0; k < this.dataEstrategia.length; k++) {
            if (
              this.dataEstrategia[k].idSprEstrategia == this.dataEstrategiaObjetivo[j].idSprEstrategia
            ) {
              console.log('Dos', this.dataEstrategia[k].idSprEstrategia + " --- "+this.dataEstrategiaObjetivo[j].idSprEstrategia);
              dataProcess.push({
                idSprEstrategia: this.dataEstrategia[k].idSprEstrategia,
                idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
                idSprEstrategiaObjetivo: this.dataEstrategiaObjetivo[j].idSprEstrategiaObjetivo,
                objetivo: this.dataObjetivo[i].nombre,
                nombre: this.dataEstrategia[k].nombre,
                estado: this.dataEstrategia[k].estado,
              });
            }
          }
        }
      }
    }
    this.dataEstrategiasMain = dataProcess;
    console.log('mapeado: ', this.dataEstrategiasMain);
  }



  mostrarDetalle(obj: any) {
    this.mostrarModalDetalle = true;
    this.formEstrategias.patchValue({
      idSprObjetivo: obj.idSprObjetivo,
      idSprAmbiente: obj.idSprAmbiente,
      nombre: obj.estrategia,
      estado: obj.estado,
    });
    this.nameObjetivoDetalle = obj.objetivo;
    this.desripcionEstrategia = obj.estrategia

  }


  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }

  onResetForm(){
    this.submitted = false;
    this.formEstrategias.reset();
  }
}
