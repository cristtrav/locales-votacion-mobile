import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Votante } from 'src/app/dto/votante.dto';
import { SessionService } from 'src/app/services/session.service';
import { VotantesService } from 'src/app/services/votantes.service';

@Component({
  selector: 'app-form-add-votante',
  templateUrl: './form-add-votante.component.html',
  styleUrls: ['./form-add-votante.component.scss'],
})
export class FormAddVotanteComponent implements OnInit {

  lstVotantes: Votante[] = [];

  isAddModalOpen: boolean = false;
  form: FormGroup = new FormGroup({
    busqueda: new FormControl(null, [Validators.required, Validators.minLength(3)])
  })

  loadingBusqueda: boolean = false;
  loadingAdd: boolean = false;

  constructor(
    private votantesSrv: VotantesService,
    private toastSrv: ToastController,
    private sessionSrv: SessionService
  ) { }

  ngOnInit() { }

  setAddModalOpen(isOpen: boolean) {
    this.isAddModalOpen = isOpen;
  }

  buscar() {
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.markAllAsTouched();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if (this.form.valid) {
      this.loadingBusqueda = true;
      forkJoin({
        votantes: this.votantesSrv.search(this.form.get('busqueda')?.value),
        cantidad: this.votantesSrv.searchCount(this.form.get('busqueda')?.value)
      }).subscribe({
        next: (resp) => {
          this.loadingBusqueda = false;
          this.lstVotantes = resp.votantes;
          let header = '';
          if(resp.cantidad > 100) header = 'Mas de 100 coincidencias';
          else header = `${resp.votantes.length} ${resp.votantes.length === 1 ? 'coincidencia' : 'coincidencias'}`;
          this.toastSrv.create({
            header,
            duration: 2000,
            color: 'success'
          }).then(t => t.present());
        },
        error: (e) => {
          this.loadingBusqueda = false;
          console.error('Error al buscar votantes', e);
          this.toastSrv.create({
            header: 'Error al buscar',
            message: e.message,
            duration: 2500,
            color: 'danger'
          }).then(t => t.present());
        }
      })
    }
  }

  add(ciVotante: number) {
    const ciVotanteCarga = this.sessionSrv.usuario?.ci;
    if (ciVotanteCarga != null) {
      this.loadingAdd = true;
      this.votantesSrv.add({ ciVotante, ciVotanteCarga }).subscribe({
        next: () => {
          this.loadingAdd = false;
          this.toastSrv.create({
            header: 'Votante agregado',
            duration: 1500,
            color: 'success'
          }).then(t => t.present());
        },
        error: (e) => {
          this.loadingAdd = false;
          console.error('Error al agregar votante', e);
          this.toastSrv.create({
            header: 'Error al agregar',
            message: e.message,
            duration: 2500,
            color: 'danger'
          }).then(t => t.present());
        }
      })
    }
  }

}
