import { SessionService } from "../services/session.service";
import { VotantesService } from "../services/votantes.service";
import { Preferences } from "@capacitor/preferences";
import { forkJoin, from } from "rxjs";

export function appInitializer(sessionSrv: SessionService) {
    return () => new Promise<void | null>(resolve => {
        forkJoin({
            usuario: from(Preferences.get({ key: 'usuario' })),
            verLocales: from(Preferences.get({key: 'autorizadoVerLocales'}))
        }).subscribe({
            
            next: (resp) => {
                const usuario = resp.usuario.value;
                const autorizadoVerLocales = resp.verLocales.value;
                if (usuario != null) sessionSrv.usuario = JSON.parse(usuario);
                if(autorizadoVerLocales) sessionSrv.autorizadoVerLocales = true;
            },
            complete: () => resolve()
        });
    })
}