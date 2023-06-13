export interface DefundDashboardPortfolioGridItem {
    icon: string,
    name: string,
    balance: DefundDashboardPortfolioBalance,
    price: DefundDashboardPortfolioPrice
}

export interface DefundDashboardPortfolioBalance {
    dollar: number,
    percentage: number,
    token: number,
    tokenKey: string
}

export interface DefundDashboardPortfolioPrice {
    dollar: number,
    percentage: number
}

