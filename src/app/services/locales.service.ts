import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResumenLocal } from '../dto/resumen-local.dto';
import { AppSettings } from '../util/app-settings';


@Injectable({
  providedIn: 'root'
})
export class LocalesService {

  private readonly url = `${AppSettings.getURLAPI()}/locales`;

  constructor(
    private http: HttpClient
  ) { }

  findAllResumen(params: HttpParams): Observable<ResumenLocal[]>{
    return this.http.get<ResumenLocal[]>(`${this.url}/resumen`, { params });
  }
}
