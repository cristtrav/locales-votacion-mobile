import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, PreloadAllModules, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { SessionService } from './services/session.service';

const canAccessMainFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(SessionService).canAccessMain()
}

const canAccessLoginFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(SessionService).canAccessSession();
}

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [canAccessLoginFn],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'votantes',
    canActivate: [canAccessMainFn],
    loadChildren: () => import('./pages/votantes/votantes.module').then( m => m.VotantesPageModule),
  },
  {
    path: 'locales',
    loadChildren: () => import('./pages/locales/locales.module').then( m => m.LocalesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

