import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { PagetitleComponent } from './components/pagetitle/pagetitle.component';


@NgModule({
  declarations: [
    ModalComponent,
    PagetitleComponent

  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    PagetitleComponent
  ]
})
export class SharedModule { }
