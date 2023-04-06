import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../dto/departamento.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  readonly url: string = `${AppSettings.getURLAPI()}/departamentos`;

  constructor(
    private http: HttpClient
  ) { }

  findAll(): Observable<Departamento[]>{
    const params = new HttpParams().append('sort', '+id');
    return this.http.get<Departamento[]>(this.url, { params });
  }
}
