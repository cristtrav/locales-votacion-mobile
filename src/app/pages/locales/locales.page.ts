import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { ResumenLocal } from 'src/app/dto/resumen-local.dto';
import { LocalesService } from 'src/app/services/locales.service';
import { SessionService } from 'src/app/services/session.service';
import { Preferences } from '@capacitor/preferences';
import { Departamento } from 'src/app/dto/departamento.dto';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { HttpParams } from '@angular/common/http';
import { FiltroLocalesComponent } from './filtro-locales/filtro-locales.component';
import { Distrito } from 'src/app/dto/distrito.dto';
import { Zona } from 'src/app/dto/zona.dto';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.page.html',
  styleUrls: ['./locales.page.scss'],
})
export class LocalesPage implements OnInit, ViewWillEnter {

  @ViewChild(FiltroLocalesComponent)
  filtroLocalesComponent!: FiltroLocalesComponent;

  lstResumenLocales: ResumenLocal[] = [];
  loadingResumenes: boolean = false;
  isModalFiltrosOpen: boolean = false;

  set filtroDepartamento(dep: Departamento | null){
    this._filtroDepartamento = dep;
    this.cargarResumenConAutorizacion();
  }
  get filtroDepartamento(): Departamento | null {
    return this._filtroDepartamento;
  }
  private _filtroDepartamento: Departamento | null = null;

  set filtroDistrito(dis: Distrito | null){
    this._filtroDistrito = dis;
    this.cargarResumenConAutorizacion();
  }
  get filtroDistrito(): Distrito | null{
    return this._filtroDistrito;
  }
  private _filtroDistrito: Distrito | null = null;

  set filtroZona(zona: Zona | null){
    this._filtroZona = zona;
    this.cargarResumenConAutorizacion();
  }
  get filtroZona(): Zona | null {
    return this._filtroZona;
  }
  private _filtroZona: Zona | null = null;

  constructor(
    private localesSrv: LocalesService,
    private toastSrv: ToastController,
    private alertSrv: AlertController,
    public sessionSrv: SessionService,
    private departamentosSrv: DepartamentosService
  ) { }

  ionViewWillEnter(): void {
    this.cargarResumenConAutorizacion();
  }

  ngOnInit() {
    Preferences.get({key: 'filtro-departamento-resumen-locales'}).then(preference => {
      if(preference.value != null)this.filtroDepartamento = <Departamento> JSON.parse(preference.value);
    });
    Preferences.get({key: 'filtro-distrito-resumen-locales'}).then(preference => {
      if(preference.value != null) this.filtroDistrito = <Distrito> JSON.parse(preference.value);
    })
    Preferences.get({key: 'filtro-zona-resumen-locales'}).then(preference => {
      if(preference.value != null) this.filtroZona = <Zona> JSON.parse(preference.value);
    })
  }

  setModalFiltrosOpen(open: boolean){
    this.isModalFiltrosOpen = open;
  }

  async cargarResumenConAutorizacion(){
    if(this.sessionSrv.autorizadoVerLocales) this.cargarResumen();
    else this.autorizar();
  }

  cargarResumen(){
    this.loadingResumenes = true;
    this.localesSrv.findAllResumen(this.getHttpParams()).subscribe({
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
  
  private getHttpParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('sort', '-cantidad')
    if(this.filtroDepartamento) params = params.append('iddepartamento', this.filtroDepartamento.id);
    if(this.filtroDistrito) params = params.append('iddistrito', this.filtroDistrito.id);
    if(this.filtroZona) params = params.append('idzona', this.filtroZona.id);
    return params;
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

  limpiarFiltroDepartamento(){
    this.filtroDepartamento = null;
    Preferences.remove({key: 'filtro-departamento-resumen-locales'});
    this.limpiarFiltroDistrito();
  }

  limpiarFiltroDistrito(){
    this.filtroDistrito = null;
    Preferences.remove({key: 'filtro-distrito-resumen-locales'});
    this.limpiarFiltroZona();
  }

  limpiarFiltroZona(){
    this.filtroZona = null;
    Preferences.remove({key: 'filtro-zona-resumen-locales'});
  }

}
