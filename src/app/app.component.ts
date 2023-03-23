import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';
import { Preferences } from '@capacitor/preferences';

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
    Preferences.remove({key: 'usuario'});
  }
  
}
