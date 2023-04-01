import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output()
  votanteAgregado = new EventEmitter<Votante>();

  lstVotantes: Votante[] = [];
  //ciVotantesExistentesSet = new Set<number>();

  isAddModalOpen: boolean = false;
  form: FormGroup = new FormGroup({
    busqueda: new FormControl(null, [Validators.minLength(3)])
  })

  loadingBusqueda: boolean = false;
  mapLoadingAdd = new Map<number, boolean>();

  constructor(
    private votantesSrv: VotantesService,
    private toastSrv: ToastController,
    private sessionSrv: SessionService,
  ) { }

  ngOnInit() { }

  setAddModalOpen(isOpen: boolean) {
    this.isAddModalOpen = isOpen;
  }

  buscar() {
    this.form.controls['busqueda']?.addValidators(Validators.required);
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.markAllAsTouched();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if (this.form.valid) {
      this.loadingBusqueda = true;
      forkJoin({
        votantes: this.votantesSrv.search(this.form.get('busqueda')?.value),
        cantidad: this.votantesSrv.searchCount(this.form.get('busqueda')?.value),
        //cargados: this.votantesSrv.findPosiblesByCi(this.sessionSrv.usuario?.ci ?? -1)
      }).subscribe({
        next: (resp) => {
          this.loadingBusqueda = false;
          //this.ciVotantesExistentesSet.clear();
          //resp.cargados.forEach(votanteExistente => {this.ciVotantesExistentesSet.add(votanteExistente.ci)});
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

  add(votante: Votante) {
    const ciVotanteCarga = this.sessionSrv.usuario?.ci;
    if (ciVotanteCarga != null) {
      this.mapLoadingAdd.set(votante.ci, true);
      this.votantesSrv.add({ ciVotante: votante.ci, ciVotanteCarga }).subscribe({
        next: () => {
          this.votanteAgregado.emit(votante);
          //this.ciVotantesExistentesSet.add(votante.ci);
          this.mapLoadingAdd.set(votante.ci, false);
          this.toastSrv.create({
            header: 'Votante agregado',
            duration: 1500,
            color: 'success'
          }).then(t => t.present());
        },
        error: (e) => {          
          this.mapLoadingAdd.set(votante.ci, false);
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
