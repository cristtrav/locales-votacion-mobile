import { Component, OnInit } from '@angular/core';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { ResumenLocal } from 'src/app/dto/resumen-local.dto';
import { LocalesService } from 'src/app/services/locales.service';

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
    private toastSrv: ToastController
  ) { }

  ionViewWillEnter(): void {
    this.cargarResumen();
  }

  ngOnInit() {
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

}
