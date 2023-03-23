import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalesPageRoutingModule } from './locales-routing.module';

import { LocalesPage } from './locales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalesPageRoutingModule
  ],
  declarations: [LocalesPage]
})
export class LocalesPageModule {}
