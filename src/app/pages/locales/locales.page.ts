import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { ResumenLocal } from 'src/app/dto/resumen-local.dto';
import { LocalesService } from 'src/app/services/locales.service';
import { SessionService } from 'src/app/services/session.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.page.html',
  styleUrls: ['./locales.page.scss'],
})
export class LocalesPage implements OnInit, ViewWillEnter {

  lstResumenLocales: ResumenLocal[] = [];
  loadingResumenes: boolean = false;

  constructor(
    private localesSrv: LocalesService,
    private toastSrv: ToastController,
    private alertSrv: AlertController,
    public sessionSrv: SessionService
  ) { }

  ionViewWillEnter(): void {
    this.cargarResumenConAutorizacion();
  }

  ngOnInit() {
  }

  async cargarResumenConAutorizacion(){
    if(this.sessionSrv.autorizadoVerLocales) this.cargarResumen();
    else this.autorizar();
  }

  cargarResumen(){
    this.loadingResumenes = true;
    this.localesSrv.findAllResumen().subscribe({
      next: (resumenes) => {
        this.loadingResumenes = false;
        this.lstResumenLocales = resumenes;
      },
      error: (e) => {
        this.loadingResumenes = false;
        console.error('Error al cargar resumenes de locales', e);
        this.toastSrv.create({
          header: 'Error al cargar',
          message: e.message,
          duration: 2000,
          color: 'danger'
        }).then(t => t.present());
      }
    })
  }

  async autorizar(){
    const autorizacion = await this.alertSrv.create({
      header: 'Autorización',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (inputs: {password: string})=>{
            if(inputs.password === 'elquedesayunadenoche4015'){
              this.sessionSrv.autorizadoVerLocales = true;
              Preferences.set({key: 'autorizadoVerLocales', value: 'true'});
              this.cargarResumen();
            }            
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ],
      inputs: [
        {
          name: 'password',
          placeholder: 'Ingresar contraseña...',
          type: 'password'
        }
      ]
    });
    const result = await autorizacion.present();
    /*console.log(result);
    console.log(autorizacion);*/
  }

}
