import {Injectable} from '@angular/core';
import {ProviderService} from "../provider/provider.service";
import {environment} from "../../../../environments/environment";
import {Contract, ethers, Signer} from "ethers";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {DefundSummary} from "../../main/network/dashboard/network-dashboard.model";
import {DipSpinnerService} from "../../services/spinner/dip-spinner.service";
import {MetamaskService} from "../metamask/metamask.service";
import {
    DefundTransaction
} from "../../main/defund/defund-dashboard/defund-dashboard-activity/defund-dashboard-activity.model";
import {
    DefundDashboardPortfolioGridItem
} from "../../main/defund/defund-dashboard/defund-dashboard-portfolio/defund-dashboard-portfolio.model";
import {AVAILABLE_TOKENS} from "../w3.model";
import {DipSnackBarService} from "../../services/snackbar/dip-snack-bar.service";
import {FactoryContractService} from "../factory-contract/factory-contract.service";
import {DipUtils} from "../../../shared/dip-utils";

@Injectable({
    providedIn: 'root'
})
export class DefundService {

    public selectedDefundSummary: DefundSummary;
    public selectedDefundSummary$: ReplaySubject<DefundSummary> = new ReplaySubject<DefundSummary>();
    public defundContract: Contract;
    public defundDescription$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public defundTransactions$: BehaviorSubject<DefundTransaction[]> = new BehaviorSubject<DefundTransaction[]>([]);
    public defundPortfolio$: BehaviorSubject<DefundDashboardPortfolioGridItem[]> = new BehaviorSubject<DefundDashboardPortfolioGridItem[]>([]);
    public myBalance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private defundContractAbi = environment.defundContract.abi;
    private erc20ContractAbi = environment.erc20Contract.abi;

    constructor(private providerService: ProviderService, private spinnerService: DipSpinnerService, private metamaskService: MetamaskService, private snackBarService: DipSnackBarService, private factoryContractService: FactoryContractService) {

        this.factoryContractService.defundsSummary$.subscribe((defundSummaries) => {
            const defund = defundSummaries.find(defundSummary => DipUtils.compareAddresses(defundSummary.address, this.selectedDefundSummary.address));

            if (defund != undefined) {
                this.selectedDefund(defund);
            }

        });
    }

    public selectedDefund(defundSummary: DefundSummary) {
        this.selectedDefundSummary = defundSummary;
        this.selectedDefundSummary$.next(defundSummary);
        this.defundContract = new Contract(this.selectedDefundSummary.address, this.defundContractAbi, this.providerService.getJsonRpcProvider()?.getSigner());
        this.getDefundDescription();
        this.getMyBalance();
    }

    public getMyBalance() {
        if (this.metamaskService.accountAddress == undefined) {
            this.myBalance$.next(0);
            return;
        }

        let promises: Promise<any>[] = [];
        promises.push(this.defundContract.balanceOf(this.metamaskService.accountAddress));
        promises.push(this.defundContract.totalSupply());

        Promise.all(promises).then(([balanceOf, totalSupply]) => {
            balanceOf = ethers.utils.formatEther(balanceOf);
            totalSupply = ethers.utils.formatEther(totalSupply);
            const userPercentage: number = totalSupply == 0.0 ? 0.0 : parseFloat(balanceOf)/parseFloat(totalSupply);
            const userAum: number = this.selectedDefundSummary.aum*userPercentage;
            this.myBalance$.next(userAum);
        });

    }

    depositOnDefund(address: string, amount: number) {
        this.spinnerService.set(true);

        const metamaskSigner: Signer = this.metamaskService.getSigner();

        // Validate
        const erc20Contract: Contract = new Contract(address, this.erc20ContractAbi, metamaskSigner);
        erc20Contract.approve(this.selectedDefundSummary.address, amount.toString())
            .then(() => {
                console.log("Success approve")
                const contract: Contract = new Contract(this.selectedDefundSummary.address, this.defundContractAbi, metamaskSigner);
                contract.contribute(amount.toString(), address)
                    .then(() => console.log("Success deposit"))
                    .catch((error) => console.log("Error", error))
                    .finally(() => {
                        this.spinnerService.set(false);
                        this.snackBarService.openSnackbar()
                        this.factoryContractService.getNetworkInformation();
                    });
            })
            .catch((error) => {
                console.log("Error", error);
                this.spinnerService.set(false);
            });

    }

    withdrawn(amount: string) {
        this.spinnerService.set(true);
        const metamaskSigner: Signer = this.metamaskService.getSigner();
        const contract: Contract = new Contract(this.selectedDefundSummary.address, this.defundContractAbi, metamaskSigner);
        contract.burnTokens(amount.toString())
            .then(() => console.log("Success withdrawn"))
            .catch((error) => console.log("Error", error))
            .finally(() => {
                this.spinnerService.set(false);
                this.snackBarService.openSnackbar();
                this.factoryContractService.getNetworkInformation();
            });
    }

    swap(amount: string, addressFrom: string, addressTo: string) {
        this.spinnerService.set(true);
        const metamaskSigner: Signer = this.metamaskService.getSigner();
        const contract: Contract = new Contract(this.selectedDefundSummary.address, this.defundContractAbi, metamaskSigner);
        contract.erc20ToErc20Transaction(amount.toString(), addressFrom, addressTo)
            .then(() => console.log("Success swap"))
            .catch((error) => console.log("Error", error))
            .finally(() => {
                this.spinnerService.set(false);
                this.snackBarService.openSnackbar();
                this.factoryContractService.getNetworkInformation();
            });
    }

    getAllTransactions() {
        this.spinnerService.set(true);

        let transactions: DefundTransaction[] = []
        let promises: Promise<any>[] = []

        this.defundContract.getTransactionsCount().then(count => {
            for (let i = count - 1; i >= 0; i--) {
                promises.push(this.defundContract.transactions(i));
            }

            Promise.all(promises)
                .then(values => {
                        values.forEach((value, index) => {

                            // Get the summary
                            const defundTransaction: DefundTransaction = {
                                type: value[0],
                                value: parseFloat(ethers.utils.formatEther(value[1])) ,
                                transferTo: value[2],
                                tokenIn: value[3],
                                tokenOut: value[4],
                                from: value[5],
                                timestamp: value[6],
                            };


                            transactions.push(defundTransaction);

                        });

                        this.defundTransactions$.next(transactions);

                    }
                )
                .finally(() => this.spinnerService.set(false));

        });


    }

    getPortfolio() {
        let defundPortfolio: DefundDashboardPortfolioGridItem[] = []
        let promises: Promise<any>[] = [];

        AVAILABLE_TOKENS.forEach(token => {
            promises.push(this.defundContract.getTokenAddressPrice(token.address));
            promises.push(this.defundContract.balanceForToken(token.address));
        });

        Promise.all(promises).then((values) => {
            values.forEach((value, index, actualValues) => {
                const realIndex: number = Math.floor(index/2);
                if (index%2 == 0) {
                    // Token price
                    defundPortfolio.push({
                        icon: AVAILABLE_TOKENS[realIndex].icon,
                        name: AVAILABLE_TOKENS[realIndex].name,
                        price: {
                            percentage: 19,
                            dollar: parseFloat(ethers.utils.formatUnits(value, 8))
                        },
                        balance: {
                            dollar: 0,
                            token: 0,
                            percentage: 10,
                            tokenKey: AVAILABLE_TOKENS[realIndex].token,
                        },
                    })
                }
                else {
                    // Balance for token
                    const lastIndex = defundPortfolio.length-1;
                    let lastToken = defundPortfolio[lastIndex];
                    lastToken.balance.token = parseFloat(AVAILABLE_TOKENS[realIndex].token === 'WBTC' ? ethers.utils.formatUnits(value, 8) : ethers.utils.formatEther(value));
                    lastToken.balance.dollar = lastToken.price.dollar * lastToken.balance.token;
                }
            });
        })
            .then(() => {
                this.defundPortfolio$.next(defundPortfolio);
            });


    }

    private getDefundDescription(): void {
        this.spinnerService.set(true);
        this.defundContract.description().then(description => {
            this.defundDescription$.next(description);
        })
            .finally(() => this.spinnerService.set(false));
    }

}
