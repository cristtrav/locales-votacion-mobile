import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Votante } from 'src/app/dto/votante.dto';
import { SessionService } from 'src/app/services/session.service';
import { VotantesService } from 'src/app/services/votantes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup = new FormGroup({
    ci: new FormControl(null, [Validators.required])
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
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.markAsTouched();
      this.form.get(ctrlName)?.updateValueAndValidity();
    })
    if (this.form.valid) {
      const ci = this.form.controls['ci'].value;
      this.votantesSrv.findByCi(ci).subscribe({
        next: (votante) => {
          this.sessionSrv.usuario = votante;
          this.toastSrv.create({
            header: 'Ingreso correcto',
            message: `Usuario: ${votante.nombres} ${votante.apellidos}`,
            color: 'success',
            duration: 3000
          }).then(t => t.present());
          this.router.navigate(['main', 'votantes'])
        },
        error: (e) => {
          console.error('Error al obtener votante por CI', e);
          this.toastSrv.create({
            header: 'Error al ingresar',
            message: e.status === 404 ? `No se encuentra el nro. de documento «${ci}»` : e.message,
            duration: 3000,
            color: 'danger'
          }).then(t => t.present())
        }
      })
    }

  }

}
