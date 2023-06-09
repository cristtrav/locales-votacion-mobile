import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { Votante } from 'src/app/dto/votante.dto';
import { SessionService } from 'src/app/services/session.service';
import { VotantesService } from 'src/app/services/votantes.service';

@Component({
  selector: 'app-votantes',
  templateUrl: './votantes.page.html',
  styleUrls: ['./votantes.page.scss'],
})
export class VotantesPage implements OnInit, ViewWillEnter {

  lstVotantes: Votante[] = [];
  isAddModalOpen: boolean = false;
  loadingVotantes: boolean = false;

  constructor(
    private votantesSrv: VotantesService,
    private sessionSrv: SessionService,
    private alertSrv: AlertController,
    private toastSrv: ToastController
  ) { }

  ionViewWillEnter(): void {
    this.cargarPosibles();
  }

  ngOnInit() {
  }

  cargarPosibles() {
    if (this.sessionSrv.usuario?.ci) {
      this.loadingVotantes = true;
      this.votantesSrv.findPosiblesByCi(this.sessionSrv.usuario.ci).subscribe({
        next: (votantes) => {
          this.lstVotantes = votantes;
          this.loadingVotantes = false;
        },
        error: (e) => {
          console.error('Error al cargar posibles votantes', e);
          this.toastSrv.create({
            header: 'Error al cargar',
            message: e.message,
            duration: 2500,
            color: 'danger'
          }).then(t => t.present());
          this.loadingVotantes = false;
        }
      })
    } else {
      console.log("usuario null")
    }
  }

  setAddModalOpen(isOpen: boolean) {
    this.isAddModalOpen = isOpen;
  }

  confirmDelete(votante: Votante) {
    this.alertSrv.create({
      header: '¿Desea eliminar el votante?',
      message: `(${votante.ci}) ${votante.nombres} ${votante.apellidos}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => { this.delete(votante) }
        }
      ]
    }).then(c => c.present());
  }

  delete(votante: Votante) {
    const ciVotanteCarga = this.sessionSrv.usuario?.ci;
    if (ciVotanteCarga) this.votantesSrv.delete({ ciVotante: votante.ci, ciVotanteCarga }).subscribe({
      next: () => {
        this.cargarPosibles();
        this.toastSrv.create({
          header: 'Votante eliminado',
          message: `«${votante.nombres} ${votante.apellidos}»`,
          duration: 1500,
          color: 'success'
        }).then(t => t.present());
      },
      error: (e) => {
        console.error('Error al eliminar votante', e);
        this.toastSrv.create({
          header: 'Error al eliminar',
          message: e.message,
          duration: 2500,
          color: 'danger'
        }).then(t => t.present());
      }
    })
  }
}
