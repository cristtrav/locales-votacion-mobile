import { SessionService } from "../services/session.service";
import { VotantesService } from "../services/votantes.service";
import { Preferences } from "@capacitor/preferences";

export function appInitializer(sessionSrv: SessionService) {
    return () => new Promise<void | null>(resolve => {
        Preferences.get({ key: 'usuario' }).then(preference => {
            if (preference != null) {
                console.log(JSON.parse(`${preference.value}`));
                sessionSrv.usuario = JSON.parse(`${preference.value}`);
            }
            resolve();
        }).catch(e => {
            resolve();
        });
    })
}