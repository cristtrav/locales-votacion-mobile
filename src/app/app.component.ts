import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    public sessionSrv: SessionService,
    private router: Router
  ) {}

  cerrarSesion(){
    this.sessionSrv.usuario = null;
    this.router.navigate(['login']);
  }
  
}
