import {Injectable} from '@angular/core';
import {Contract, ethers, Signer} from 'ethers';
import {environment} from "../../../../environments/environment";
import {ProviderService} from "../provider/provider.service";
import {MetamaskService} from "../metamask/metamask.service";
import {BehaviorSubject, from, Observable, of, ReplaySubject, tap} from "rxjs";
import {DipSpinnerService} from "../../services/spinner/dip-spinner.service";
import {
    DefundSummary,
    NetworkDashboardManagersGridItem
} from "../../main/network/dashboard/network-dashboard.model";
import {DipUtils} from "../../../shared/dip-utils";
import {DipSnackBarService} from "../../services/snackbar/dip-snack-bar.service";




@Injectable({
    providedIn: 'root'
})
export class FactoryContractService {

    // Utils
    private utils = DipUtils;

    // Constants
    private factoryContractAbi = environment.factoryContract.abi;
    private defundContractAbi = environment.defundContract.abi;
    private factoryContractAddress = environment.factoryContract.address;
    public factoryContract: Contract;

    // Network
    public contractLoaded$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    public defundsSummary$: BehaviorSubject<DefundSummary[]> = new BehaviorSubject<DefundSummary[]>([]);
    public defundsSummary: DefundSummary[] = [];
    public managersSummary$: BehaviorSubject<NetworkDashboardManagersGridItem[]> = new BehaviorSubject<NetworkDashboardManagersGridItem[]>([]);
    public defundsCount$: ReplaySubject<number> = new ReplaySubject<number>();
    public totalAum$: ReplaySubject<number> = new ReplaySubject<number>();

    // User defunds
    public connectedUserAddress: string = '';
    public connectedUserDefunds$: BehaviorSubject<DefundSummary[]> = new BehaviorSubject<DefundSummary[]>([]);

    constructor(private providerService: ProviderService,
                private metamaskService: MetamaskService,
                private spinnerService: DipSpinnerService,
                private snackBarService: DipSnackBarService) {

        // Factory contract to load the data without metamask
        this.factoryContract = new Contract(this.factoryContractAddress, this.factoryContractAbi, providerService.getJsonRpcProvider()?.getSigner());
        this.factoryContract.deployed()
            .then((contract) => {
                console.log(contract);
                this.getNetworkInformation();
                this.contractLoaded$.next(true);
            })
            .catch((error) => console.log(error));

        // Subscribe to metamask service to get the connected address
        this.metamaskService.accountAddress$.subscribe(address => {
            this.connectedUserAddress = address;
            this.calculateConnectedUserDefunds();
        });
    }

    public createDefund(name: string, description: string) {
        this.spinnerService.set(true);

        const metamaskSigner: Signer = this.metamaskService.getSigner();
        const contract: Contract = new Contract(this.factoryContractAddress, this.factoryContractAbi, metamaskSigner);
        contract.createDeFund(name, description)
            .then((contractAddress) => console.log("Success", contractAddress))
            .catch((error) => console.log("Error", error))
            .finally(() => {
                this.spinnerService.set(false);
                this.snackBarService.openSnackbar();
                this.getNetworkInformation();
            });
    }

    public printDeployedDefunds() {
        return from(this.factoryContract.getDeployedDeFund());
    }

    public getNetworkInformation() {
        this.spinnerService.set(true);
        this.factoryContract.getDeployedDeFund().then(
            (defundAddress: string[]) => {
                // Get defund count
                this.defundsCount$.next(defundAddress.length);
                this.getAllDefundsInformation(defundAddress);
            }
        )
    }

    private getAllDefundsInformation(defundAddress: string[]) {
        let defunds: DefundSummary[] = [];
        let managers: Map<string, NetworkDashboardManagersGridItem> = new Map<string, NetworkDashboardManagersGridItem>();
        let totalAum: number = 0;
        let promises: Promise<any>[] = [];

        // Get all the promises
        defundAddress.forEach((defund: string) => {
            const contarct: Contract = new Contract(defund, this.defundContractAbi, this.providerService.getJsonRpcProvider()?.getSigner())
            promises.push(contarct.getSummary());
        });

        Promise.all(promises).then(values => {
            values.forEach((value, index) => {

                // Get the summary
                const defundGridItem: DefundSummary = {
                    address: defundAddress[index],
                    name: value[0],
                    aum: parseFloat(ethers.utils.formatEther(value[1])),
                    manager: value[2],
                    network: 'assets/img/eth-icon.png',
                    members: value[3].toNumber(),
                };
                defunds.push(defundGridItem);

                // Sum total defunds aum
                totalAum += defundGridItem.aum;

                // Fill the map
                if (managers.has(defundGridItem.manager)) {
                    let manager: NetworkDashboardManagersGridItem = managers.get(defundGridItem.manager);
                    manager.aum += defundGridItem.aum;
                    manager.defunds += 1;
                    manager.members += defundGridItem.members;
                    managers.set(defundGridItem.manager, manager);
                }
                else {
                    let manager: NetworkDashboardManagersGridItem = {
                        name: defundGridItem.manager,
                        aum: defundGridItem.aum,
                        members: defundGridItem.members,
                        defunds: 1,
                        network: defundGridItem.network,
                    }
                    managers.set(defundGridItem.manager, manager);
                }

            });

            // Calculate user

            let managerList: NetworkDashboardManagersGridItem[] = [];
            managers.forEach((value, key, map) => managerList.push(value));
            this.managersSummary$.next(managerList);
            this.defundsSummary = defunds;
            this.defundsSummary$.next(defunds);
            this.totalAum$.next(totalAum);
            this.calculateConnectedUserDefunds();
            this.spinnerService.set(false);
        })
    }

    private calculateConnectedUserDefunds() {
        if (this.connectedUserAddress && this.defundsSummary.length > 0) {
            const cuDefunds: DefundSummary[] = this.defundsSummary
                .filter(defund => this.utils.compareAddresses(defund.manager, this.connectedUserAddress));
            this.connectedUserDefunds$.next(cuDefunds);
        }
    }
}
