import {Injectable} from '@angular/core';
import {ProviderService} from "../provider/provider.service";
import {environment} from "../../../../environments/environment";
import {Contract, ethers, Signer} from "ethers";
import {BehaviorSubject, combineLatest} from "rxjs";
import {DipSpinnerService} from "../../services/spinner/dip-spinner.service";
import {MetamaskService} from "../metamask/metamask.service";
import {
    DefundTransaction
} from "../../main/defund/defund-dashboard/defund-dashboard-activity/defund-dashboard-activity.model";
import {FactoryContractService} from "../factory-contract/factory-contract.service";
import {PortfolioDefundSummary, PortfolioManagerSummary} from "../../main/portfolio/dashboard/portfolio.model";
import {DefundSummary, NetworkDashboardManagersGridItem} from "../../main/network/dashboard/network-dashboard.model";

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {

    public myBalance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private defundContractAbi = environment.defundContract.abi;
    private erc20ContractAbi = environment.erc20Contract.abi;
    public defundsSummary$: BehaviorSubject<PortfolioDefundSummary[]> = new BehaviorSubject<PortfolioDefundSummary[]>([]);
    public managersSummary$: BehaviorSubject<PortfolioManagerSummary[]> = new BehaviorSubject<PortfolioManagerSummary[]>([]);

    constructor(private providerService: ProviderService, private spinnerService: DipSpinnerService, private metamaskService: MetamaskService, private factoryContractService: FactoryContractService) {
    }

    public initPortfolio() {
        if (this.metamaskService.accountAddress) {

            combineLatest([this.factoryContractService.contractLoaded$, this.factoryContractService.defundsSummary$])
                .subscribe(([contractLoaded, defundSummaries]) => {

                    let promises: Promise<any>[] = [];

                    defundSummaries.forEach(defundSummary => {
                        let contract: Contract = new Contract(defundSummary.address, this.defundContractAbi, this.metamaskService.getSigner());
                        promises.push(contract.balanceOf(this.metamaskService.accountAddress));
                    })

                    let myBalance: number = 0;
                    let portfolioDefunds: PortfolioDefundSummary[] = []
                    let managers: Map<string, PortfolioManagerSummary> = new Map<string, PortfolioManagerSummary>();


                    Promise.all(promises)
                        .then((values) => {
                            values.forEach((value, index, values) => {
                                const dollarValue: number = parseFloat(ethers.utils.formatEther(value));
                                console.log(dollarValue, defundSummaries[index]);
                                if (dollarValue > 0) {

                                    myBalance += dollarValue;

                                    let defundSummary: PortfolioDefundSummary = defundSummaries[index];
                                    defundSummary.balance = dollarValue;
                                    defundSummary.performance = 19;
                                    portfolioDefunds.push(defundSummary);

                                    // Fill the map
                                    if (managers.has(defundSummary.manager)) {
                                        let manager: PortfolioManagerSummary = managers.get(defundSummary.manager);
                                        manager.aum += defundSummary.aum;
                                        manager.defunds += 1;
                                        manager.members += defundSummary.members;
                                        manager.balance += dollarValue;
                                        managers.set(defundSummary.manager, manager);
                                    } else {
                                        let manager: PortfolioManagerSummary = {
                                            name: defundSummary.manager,
                                            aum: defundSummary.aum,
                                            members: defundSummary.members,
                                            defunds: 1,
                                            network: defundSummary.network,
                                            balance: dollarValue,
                                            performance: 19
                                        }
                                        managers.set(defundSummary.manager, manager);
                                    }

                                }
                            });
                        })
                        .finally(() => {
                            let managerList: PortfolioManagerSummary[] = [];
                            managers.forEach((value, key, map) => managerList.push(value));
                            this.defundsSummary$.next(portfolioDefunds);
                            this.managersSummary$.next(managerList);
                            this.myBalance$.next(myBalance);
                        });

                });

        }
    }
}
