import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VotanteLocal } from '../dto/votante-local.dto';
import { Votante } from '../dto/votante.dto';
import { AppSettings } from '../util/app-settings';
import { SessionService } from './session.service';


@Injectable({
  providedIn: 'root'
})
export class VotantesService {

  private readonly url = `${AppSettings.getURLAPI()}/votantes`;

  constructor(
    private http: HttpClient,
    private sessionSrv: SessionService
    ) { }

  search(query: string): Observable<Votante[]> {
    const params = new HttpParams()
    .append('search', query)
    .append('limit', '100');
    return this.http.get<Votante[]>(this.url, { params });
  }

  searchCount(query: string): Observable<number>{
    const params = new HttpParams().append('search', query);
    return this.http.get<number>(`${this.url}/count`, { params });
  }

  findByCi(ci: number): Observable<Votante> {
    return this.http.get<Votante>(`${this.url}/${ci}`);
  }

  findPosiblesByCi(ci: number): Observable<Votante[]> {
    return this.http.get<Votante[]>(`${this.url}/${ci}/posibles`);
  }

  add(votanteLocal: VotanteLocal): Observable<any>{
    return this.http.post(`${this.url}/${votanteLocal.ciVotanteCarga}/posibles`, votanteLocal);
  }

  delete(votanteLocal: VotanteLocal): Observable<any>{
    return this.http.delete(`${this.url}/${votanteLocal.ciVotanteCarga}/posibles/${votanteLocal.ciVotante}`);
  }
}
