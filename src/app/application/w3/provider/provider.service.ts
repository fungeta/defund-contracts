import {Injectable} from '@angular/core';
import {providers} from "ethers";

@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    private provider: providers.BaseProvider;

    constructor() {
        this.provider = new providers.JsonRpcProvider();
    }

    public getJsonRpcProvider(): providers.JsonRpcProvider | undefined {
        if (this.provider instanceof providers.JsonRpcProvider) {
            return this.provider;
        }
        return undefined;
    }

}
