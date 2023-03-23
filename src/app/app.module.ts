import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { SessionService } from './services/session.service';
import { VotantesService } from './services/votantes.service';
import { appInitializer } from './util/app.initializer';

registerLocaleData(es)

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-PY' },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [SessionService, VotantesService]}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
