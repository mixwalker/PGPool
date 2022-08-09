import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjecttypePipe } from './projecttype.pipe';



@NgModule({
  declarations: [
    ProjecttypePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProjecttypePipe
  ]
})
export class PipeProjecttypeModule { }
