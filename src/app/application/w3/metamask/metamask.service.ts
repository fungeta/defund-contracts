import {Injectable} from '@angular/core';
import MetaMaskSDK from '@metamask/sdk';
import {BigNumber, providers, Signer, utils} from "ethers";
import {ReplaySubject} from "rxjs";
import {DefundSummary} from "../../main/network/dashboard/network-dashboard.model";

@Injectable({
    providedIn: 'root'
})
export class MetamaskService {

    private static LOCAL_STORAGE_ADDRESS_KEY = 'metamask-account-address';

    private readonly ethereum: any = undefined;
    public accountAddress$: ReplaySubject<string> = new ReplaySubject<string>();
    public data$: ReplaySubject<any> = new ReplaySubject<any>();
    public accountAddress: string | undefined;
    private metamaskSdk: MetaMaskSDK = new MetaMaskSDK();
    private metamaskProvider: providers.Web3Provider | undefined = undefined;

    constructor() {
        if (!this.metamaskSdk.getProvider()) {
            console.log("No metamask");
        } else {
            this.ethereum = this.metamaskSdk.getProvider();
            const address = localStorage.getItem(MetamaskService.LOCAL_STORAGE_ADDRESS_KEY);
            console.log("Constructor", address);
            if (address) {
                this.afterConnect(address);
            }
        }
    }

    public connectToAccount() {
        if (this.ethereum) {
            this.ethereum.request({ method: 'eth_requestAccounts' })
                .catch((error) => {
                    if (error.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                        console.log('Please connect to MetaMask.');
                    } else {
                        console.error(error);
                    }
                })
                .then((response: string[]) => {
                    this.afterConnect(response[0]);
                });
        }
    }

    private afterConnect(address: string) {
        this.accountAddress = address;
        console.log(this.accountAddress);
        this.metamaskProvider = new providers.Web3Provider(this.ethereum);
        this.getAccountBalance();
        console.log("Emit:", this.accountAddress);
        this.accountAddress$.next(this.accountAddress);
        localStorage.setItem(MetamaskService.LOCAL_STORAGE_ADDRESS_KEY, this.accountAddress);
    }

    private getAccountBalance() {
        this.metamaskProvider.getBalance(this.accountAddress).then((balance: BigNumber) => {
            console.log(utils.formatEther(balance));
        })
    }

    disconnect() {
        this.metamaskProvider = undefined;
        this.accountAddress = undefined;
        this.accountAddress$.next(null);
        localStorage.removeItem(MetamaskService.LOCAL_STORAGE_ADDRESS_KEY);
    }

    public getSigner(): Signer {
        return this.metamaskProvider.getSigner();
    }
}
