import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotantesPage } from './votantes.page';

const routes: Routes = [
  {
    path: '',
    component: VotantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotantesPageRoutingModule {}
