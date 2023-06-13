import {Token} from "../../w3/w3.model";

export interface AssetsModel extends Token {
    price: number,
    marketCap: number,
    performance: number,
}

export const ASSETS_AVAILABLE_TOKENS: AssetsModel[] = [
    {
        name: "Wrapped Ether",
        token: "WETH",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        icon: 'assets/img/eth-icon.png',
        price: 1862.22,
        marketCap: 225560377297,
        performance: 0
    },
    {
        name: "Chainlink",
        token: "LINK",
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        icon: 'assets/img/link.png',
        price: 6.40,
        marketCap: 3324154880,
        performance: 0
    },
    {
        name: "Wrapped Bitcoin",
        token: "WBTC",
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        icon: 'assets/img/wbtc.png',
        price: 26844.12,
        marketCap: 523825407009,
        performance: 10
    },
    {
        name: "DAI",
        token: "DAI",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        icon: 'assets/img/dai.png',
        price: 1,
        marketCap: 4604940368,
        performance: -1
    }
]
