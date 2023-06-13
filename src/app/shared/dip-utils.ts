import {
    DefundDashboardPortfolioGridItem
} from "../application/main/defund/defund-dashboard/defund-dashboard-portfolio/defund-dashboard-portfolio.model";
import {DefundSummary} from "../application/main/network/dashboard/network-dashboard.model";
import {AVAILABLE_TOKENS} from "../application/w3/w3.model";
import {BigNumber} from "ethers";

export class DipUtils {

    // Create our number formatter.
     private static dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    public static formatDollar(amount: number): string {
        if (amount != undefined) {
            return DipUtils.dollarFormatter.format(amount);
        }
        return '';
    }

    public static formatAddress(address: string): string {
        if (address) {
            return `${address.substring(0, 6)}...${address.substring(address.length-4)}`;
        }
        return '';
    }

    public static compareAddresses(address1: string, address2: string): boolean {
        return address1.toLowerCase() === address2.toLowerCase();
    }

    public static isManager(defund: DefundSummary, connectedUser: string) {
        return this.compareAddresses(defund.manager, connectedUser);
    }

    public static calculateTokenFromAddress(address: string): string {
        return AVAILABLE_TOKENS.find((token) => DipUtils.compareAddresses(token.address, address)).token;
    }

    public static parseTimestamp(timestamp: BigNumber): string {
        let dateTime = new Date(timestamp.toNumber());
        return dateTime.toISOString();
    }

    public static getMyPerformance(performancePercentage: number): string {
        let performanceString: string = `${performancePercentage}%`

        if (performancePercentage > 0) {
            return '+' + performanceString;
        } else if (performancePercentage < 0) {
            return performanceString;
        } else {
            return performanceString;
        }
    }

    public static  getPerformanceClass(performancePercentage: number): string {
        if (performancePercentage > 0) {
            return 'positive-percentage';
        } else if (performancePercentage < 0) {
            return 'negative-percentage';
        } else {
            return '';
        }
    }

}
