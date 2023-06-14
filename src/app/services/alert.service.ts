import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr:ToastrService) { }
  
  success(title="Mensaje", texto="titulo") {
    this.toastr.success(texto,title);
  }
  info(title="Mensaje", texto="titulo") {
    this.toastr.info(texto,title);
  }
  warning(title="Mensaje", texto="titulo") {
    this.toastr.warning(texto,title);
  }
  error(title="Mensaje", texto="titulo") {
    this.toastr.error(texto,title);
  }


alert(t2 ="Titulo", t = "Mensaje",  tipo="success"){
   switch(tipo) { 
    case "success": { 
       this.toastr.success(t, t2);
       break; 
    } 
    case "info": { 
       this.toastr.info(t, t2);
       break; 
    }  case "warning": { 
       this.toastr.warning(t, t2);
       break; 
    }  case "error": { 
       this.toastr.error(t, t2);
       break; 
    }  
 } 
}

createOk(title ="Correcto!", text = "Registro credo satisfactoriamente"){
    this.toastr.success(text, title);
}

createError(text ="Ocurrio un error!"){
  this.toastr.error(text, 'Ups');

}
updateOk(title ="Correcto!", text = "Registro actualizado satisfactoriamente"){
    this.toastr.success(text, title);
}

updateError(text ="Ocurrio un error!"){
  this.toastr.error(text, 'Ups');
} 

deleteOk(title="Correcto!",text="Registro eliminado satisfactoriamente" ){
  this.toastr.success(text, title);

  }

deleteError(title= "Ups!", text= "No fue posible eliminar el registro"){
    this.toastr.error(text, title);
 }

 fechaError(text = "Fecha fin no puede ser menor fecha fin"){
  this.toastr.error(text, 'Ups');
} 

}
