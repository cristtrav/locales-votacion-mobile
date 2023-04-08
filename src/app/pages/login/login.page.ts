import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { VotantesService } from 'src/app/services/votantes.service';
import { Preferences } from '@capacitor/preferences';
import { Votante } from 'src/app/dto/votante.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loadingLogin: boolean = false;

  form: FormGroup = new FormGroup({
    ci: new FormControl(null)
  })

  constructor(
    private votantesSrv: VotantesService,
    private toastSrv: ToastController,
    private router: Router,
    private sessionSrv: SessionService
  ) { }

  ngOnInit() {
  }

  ingresar() {
    this.form.controls['ci'].addValidators(Validators.required);
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.markAsTouched();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if (this.form.valid) {
      this.loadingLogin = true;
      const ci = this.form.controls['ci'].value;
      this.votantesSrv.findByCi(ci).subscribe({
        next: async (votante) => {
          this.loadingLogin = false;
          if (!(await this.yaEstoyRegistrado(votante.ci))) await this.registrarAUnoMismo(votante);
          this.sessionSrv.usuario = votante;
          this.toastSrv.create({
            header: 'Ingreso correcto',
            message: `Usuario: ${votante.nombres} ${votante.apellidos}`,
            color: 'success',
            duration: 1500
          }).then(t => t.present());
          Preferences.set({ key: 'usuario', value: `${JSON.stringify(votante)}` });
          this.router.navigate(['votantes'])
        },
        error: (e) => {
          this.loadingLogin = false;
          console.error('Error al obtener votante por CI', e);
          this.toastSrv.create({
            header: 'Error al ingresar',
            message: e.status === 404 ? `No se encuentra el nro. de documento «${ci}»` : e.message,
            duration: 2000,
            color: 'danger'
          }).then(t => t.present())
        }
      })
    }
  }

  private async yaEstoyRegistrado(ci: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.votantesSrv.findPosiblesByCi(ci).subscribe({
        next: (votantes) => {
          resolve(votantes.find(vot => vot.ci == ci) != null);
        },
        error: (e) => {
          console.error('Error al cargar posibles', e);
          reject(e);
        }
      })
    });
  }

  private async registrarAUnoMismo(votante: Votante): Promise<void> {
    return new Promise((resolve, reject) => {
      this.votantesSrv.add({ ciVotante: votante.ci, ciVotanteCarga: votante.ci }).subscribe({
        next: () => resolve(),
        error: (e) => {
          console.error('Error al cargar a uno mismo como votante', e)
          reject();
        }
      });
    });
    
  }

}
