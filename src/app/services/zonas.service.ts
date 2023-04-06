import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zona } from '../dto/zona.dto';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  private readonly url = `${AppSettings.getURLAPI()}/zonas`;

  constructor(
    private http: HttpClient
  ) { }

  findAll(params: HttpParams): Observable<Zona[]>{
    return this.http.get<Zona[]>(this.url, { params });
  }
}
