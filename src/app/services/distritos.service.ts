import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Distrito } from '../dto/distrito.dto';

@Injectable({
  providedIn: 'root'
})
export class DistritosService {

  private readonly url = `${AppSettings.getURLAPI()}/distritos`

  constructor(
    private http: HttpClient
  ) { }

  findAll(params: HttpParams): Observable<Distrito[]>{
    return this.http.get<Distrito[]>(this.url, { params });
  }
}
