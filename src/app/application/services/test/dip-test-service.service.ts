import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DipTestServiceService {

    public sidenavEventEmiter: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    public openSidenav(option: string) {
        this.sidenavEventEmiter.emit(option);
    }
}
