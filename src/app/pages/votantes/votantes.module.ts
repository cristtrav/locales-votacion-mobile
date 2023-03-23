import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotantesPageRoutingModule } from './votantes-routing.module';

import { VotantesPage } from './votantes.page';
import { FormAddVotanteComponent } from './form-add-votante/form-add-votante.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VotantesPageRoutingModule,
    ScrollingModule
  ],
  declarations: [VotantesPage, FormAddVotanteComponent]
})
export class VotantesPageModule {}
