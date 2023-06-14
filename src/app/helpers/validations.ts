import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class Validations {

validateInteger(nroMayor:number, nroMenor:number){
if(nroMayor < nroMenor){
  alert("")
}
}

}