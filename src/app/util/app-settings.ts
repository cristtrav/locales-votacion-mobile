import { environment } from "src/environments/environment";

export class AppSettings{
    public static getURLAPI(): string{        
        if(!environment.production) return "http://localhost:3000/api";
        return `${location.protocol}//${location.hostname}:${location.port}/api`;
    }
}