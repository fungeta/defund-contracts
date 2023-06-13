// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeedBtc_Eth;
    AggregatorV3Interface internal priceFeedLink_Usd;
    AggregatorV3Interface internal priceFeedWbtc_Usd;
    AggregatorV3Interface internal priceFeedWeth_Usd;
    AggregatorV3Interface internal priceFeedDai_Usd;

    address public link;
    address public wbtc;
    address public weth;
    address public dai;
    address[] public supportedTokens;
    address public btc_eth;
    address public btc_usd;
    address public link_usd;
    address public eth_usd;
    address public dai_usd;

    constructor() {
        // Sepolia
        //link = 0x8a0E31de20651fe58A369fD6f76c21A8FF7f8d42;
        //wbtc = 0xf864F011C5A97fD8Da79baEd78ba77b47112935a;
        //weth = 0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92;

        // Sepolia
        //btc_usd = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43;
        //link_usd = 0xc59E3633BAAC79493d908e63626716e204A45EdF;
        //eth_usd = 0x694AA1769357215DE4FAC081bf1f309aDC325306;

        // Mainnet
        link = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
        wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
        weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

        // Mainnet
        btc_usd = 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c;
        link_usd = 0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c;
        eth_usd = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        dai_usd = 0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9;


        priceFeedWbtc_Usd = AggregatorV3Interface(btc_usd);
        priceFeedLink_Usd = AggregatorV3Interface(link_usd);
        priceFeedWeth_Usd = AggregatorV3Interface(eth_usd);
        priceFeedDai_Usd = AggregatorV3Interface(dai_usd);

        supportedTokens = [wbtc, link, weth]; // Supported tokens priced on USD
    }

    function getLatestPriceLink_Usd() public view returns (int) {
        (, int price, , ,) = priceFeedLink_Usd.latestRoundData();
        return price;
    }

    function getLatestPriceWbtc_Usd() public view returns (int) {
        (, int price, , ,) = priceFeedWbtc_Usd.latestRoundData();
        return price;
    }

    function getLatestPriceWeth_Usd() public view returns (int) {
        (, int price, , ,) = priceFeedWeth_Usd.latestRoundData();
        return price;
    }

    function getLatestPriceDai_Usd() public view returns (int) {
        (, int price, , ,) = priceFeedDai_Usd.latestRoundData();
        return price;
    }

    function getPriceByTokenPair(address tokenPairAddress) public view returns (uint) {
        if (tokenPairAddress == link) {
            return uint(getLatestPriceLink_Usd());
        } else if (tokenPairAddress == wbtc) {
            return uint(getLatestPriceWbtc_Usd());
        } else if (tokenPairAddress == weth) {
            return uint(getLatestPriceWeth_Usd());
        } else if (tokenPairAddress == dai) {
            return uint(getLatestPriceDai_Usd());
        } else {
            revert("Token address is not one of the supported addresses");
        }
    }

    function getPriceByTokenAddress(address tokenAddress) public view returns (uint) {
        if (tokenAddress == wbtc) {
            return uint(getLatestPriceWbtc_Usd());
        } else if (tokenAddress == weth) {
            return uint(getLatestPriceWeth_Usd());
        } else if (tokenAddress == link) {
            return uint(getLatestPriceLink_Usd());
        } else if (tokenAddress == dai) {
            return uint(getLatestPriceDai_Usd());
        } else {
            revert("Token address is not one of the supported addresses");
        }
    }

    function getPriceByTokenIndex(uint index_) public view returns (uint) {
        //require(index_ <= supportedTokens.length && index_ <= 0);

        return getPriceByTokenAddress(supportedTokens[index_]);
    }

}