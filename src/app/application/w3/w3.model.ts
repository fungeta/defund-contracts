export interface ContractModel {
    address?: string,
    abi: any[]
}

export interface Token {
    name: string,
    token: string,
    address: string,
    icon?: string,
}

export const AVAILABLE_TOKENS: Token[] = [
    {
        name: "WETH",
        token: "WETH",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        icon: 'assets/img/eth-icon.png'
    },
    {
        name: "LINK",
        token: "LINK",
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        icon: 'assets/img/link.png'
    },
    {
        name: "WBTC",
        token: "WBTC",
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        icon: 'assets/img/wbtc.png'
    },
    {
        name: "DAI",
        token: "DAI",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        icon: 'assets/img/dai.png'
    }
]
