import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, PreloadAllModules, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { SessionService } from './services/session.service';

const canAccessMainFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(SessionService).canAccessMain()
}

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'main',
    canActivate: [canAccessMainFn],
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

