import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Departamento } from 'src/app/dto/departamento.dto';
import { SessionService } from 'src/app/services/session.service';
import { Preferences } from '@capacitor/preferences';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { ToastController } from '@ionic/angular';
import { Distrito } from 'src/app/dto/distrito.dto';
import { HttpParams } from '@angular/common/http';
import { DistritosService } from 'src/app/services/distritos.service';
import { Zona } from 'src/app/dto/zona.dto';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-filtro-locales',
  templateUrl: './filtro-locales.component.html',
  styleUrls: ['./filtro-locales.component.scss'],
})
export class FiltroLocalesComponent  implements OnInit {

  @Output()
  filtroDepartamento = new EventEmitter<Departamento | null>();
  @Output()
  filtroDistrito = new EventEmitter<Distrito | null>();
  @Output()
  filtroZona = new EventEmitter<Zona | null>();

  lstDepartamentosFiltro: Departamento[] = [];
  lstDistritosFiltro: Distrito[] = [];
  lstZonasFiltro: Zona[] = [];

  filtroIdDepartamento: number | null = null;
  filtroIdDistrito: number | null = null;
  filtroIdZona: number | null = null;

  loadingDepartamentos: boolean = false;
  loadingDistritos: boolean = false;
  loadingZonas: boolean = false;

  constructor(
    public sessionSrv: SessionService,
    private departamentosSrv: DepartamentosService,
    private distritosSrv: DistritosService,
    private zonasSrv: ZonasService,
    private toastSrv: ToastController
  ) { }

  ngOnInit() {
    this.cargarDepartamentos();
    this.restaurarFiltroDepartamento();
    this.restaurarFiltroDistrito();
    this.restaurarFiltroZona();
  }

  cargarDepartamentos(){
    this.loadingDepartamentos = true;
    this.departamentosSrv.findAll().subscribe({
      next: (departamentos) => {
        this.loadingDepartamentos = false;
        this.lstDepartamentosFiltro = departamentos;
      },
      error: (e) => {
        this.loadingDepartamentos = false;
        console.error('Error al cargar departamentos', e);
        this.toastSrv.create({
          header: 'Error al cargar departamentos',
          message: e.message,
          duration: 2000,
          color: 'danger'
        }).then(t => t.present());
      }
    })
  }

  cargarDistritos(iddepartamento: number){
    this.loadingDistritos = true;
    const params = new HttpParams().append('iddepartamento', iddepartamento);
    this.distritosSrv.findAll(params).subscribe({
      next: (distritos) =>{
        this.loadingDistritos = false;
        this.lstDistritosFiltro = distritos;
      },
      error: (e) => {
        this.loadingDistritos = false;
        console.error('Error al cargar distritos', e);
        this.toastSrv.create({
          header: 'Error al cargar distritos',
          message: e.message,
          duration: 2000,
          color: 'danger'
        }).then(t => t.present());
      }
    })
  }

  cargarZonas(iddepartamento: number, iddistrito: number){
    this.loadingZonas = true;
    const params = new HttpParams()
    .append('iddepartamento', iddepartamento)
    .append('iddistrito', iddistrito);
    this.zonasSrv.findAll(params).subscribe({
      next: (zonas) => {
        this.loadingZonas = false;
        this.lstZonasFiltro = zonas;
      },
      error: (e) => {
        this.loadingZonas = false;
        console.error('Error al cargar zonas', e);
        this.toastSrv.create({
          header: 'Error al cargar zonas',
          message: e.message,
          duration: 2000,
          color: 'danger'
        }).then(t => t.present());
      }
    })
  }

  seleccionarFiltroDepartamento(iddep: number){
    this.cargarDistritos(iddep);
    const departamento = this.lstDepartamentosFiltro.find(dep => dep.id == iddep);
    if(departamento){
      Preferences.set({key: 'filtro-departamento-resumen-locales', value: JSON.stringify(departamento)});
      this.filtroDepartamento.emit(departamento);
    }
    this.limpiarFiltroDistrito();
  }

  seleccionarFiltroDistrito(iddistrito: number){
    this.cargarZonas(this.filtroIdDepartamento ?? -1, iddistrito);
    const distrito = this.lstDistritosFiltro.find(dist => dist.id == iddistrito);
    if(distrito){
      Preferences.set({key: 'filtro-distrito-resumen-locales', value: JSON.stringify(distrito)});
      this.filtroDistrito.emit(distrito);
    }
    this.limpiarFiltroZona();
  }

  seleccionarFiltroZona(idzona: number){
    const zona = this.lstZonasFiltro.find(zona => zona.id == idzona);
    if(zona){
      Preferences.set({key: 'filtro-zona-resumen-locales', value: JSON.stringify(zona)});
      this.filtroZona.emit(zona);
    }
  }

  limpiarFiltroDepartamento(){
    this.filtroIdDepartamento = null;
    Preferences.remove({key: 'filtro-departamento-resumen-locales'});
    this.filtroDepartamento.emit(null);
    this.limpiarFiltroDistrito();
  }

  limpiarFiltroDistrito(){
    this.filtroIdDistrito = null;
    Preferences.remove({key: 'filtro-distrito-resumen-locales'});
    this.filtroDistrito.emit(null);
    this.limpiarFiltroZona();
  }
  
  limpiarFiltroZona(){
    this.filtroIdZona = null;
    Preferences.remove({key: 'filtro-zona-resumen-locales'});
    this.filtroZona.emit(null);
  }

  private restaurarFiltroDepartamento(){
    Preferences.get({key: 'filtro-departamento-resumen-locales'}).then(preference => {
      if(preference.value != null){
        const departamento: Departamento = <Departamento>JSON.parse(preference.value);
        this.filtroDepartamento.emit(departamento);
        this.filtroIdDepartamento = departamento.id;
        this.cargarDistritos(departamento.id);
      }
    })
  }

  private restaurarFiltroDistrito(){
    Preferences.get({key: 'filtro-distrito-resumen-locales'}).then(preference => {
      if(preference.value != null){
        const distrito = <Distrito>JSON.parse(preference.value);
        this.filtroDistrito.emit(distrito);
        this.filtroIdDistrito = distrito.id;
        this.cargarZonas(distrito.iddepartamento, distrito.id);
      }
    })
  }

  private restaurarFiltroZona(){
    Preferences.get({key: 'filtro-zona-resumen-locales'}).then(preference => {
      if(preference.value != null){
        const zona = <Zona> JSON.parse(preference.value);
        this.filtroZona.emit(zona);
        this.filtroIdZona = zona.id;
      }
    })
  }

}
