import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Votante } from '../dto/votante.dto';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  usuario: Votante | null = null;

  constructor(
    private router: Router
  ) { }

  canAccessMain(): boolean | UrlTree{
    if(this.usuario == null) return this.router.createUrlTree(['login'])
    return true;
  }

  canAccessSession(): boolean | UrlTree{
    if(this.usuario != null) return this.router.createUrlTree(['main', 'votantes']);
    return true;
  }

}
