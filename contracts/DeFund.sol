// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PriceFeed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeFundFactory {
    address payable[] public deployedDeFunds;

    function createDeFund(string memory name_, string memory description_) public returns(address) {
        uint fee_ = 1;

        address newDeFund = address(new DeFund(name_, description_, msg.sender, fee_));
        deployedDeFunds.push(payable(newDeFund));

        return newDeFund;
    }

    function getDeployedDeFund() public view returns (address payable[] memory) {
        return deployedDeFunds;
    }
}

interface Swapper {
    function swapInTokenToOutToken(uint256 _amountIn, address _in, address _out) external returns (uint256 amountOut);
    function balanceForToken(address _tokenAddress) external view returns (uint256);
    function transferToken(address _recipient, uint256 _amount, address _tokenAddress) external returns(bool);
    function transferEth(address _to, uint256 _amount) external payable;
    function unwrapEth(address payable _wrapper, uint256 _amount) external payable;
}

contract DeFund is Ownable, ERC20 {
    //mapping(address => bool) public whitelist;
    bool isPrivate; // Add a new boolean parameter to the constructor

    IERC20 public tokenIn;
    // address public denAssetAddress;
    PriceConsumerV3 public priceConsumer;
    address priceConsumerAddress = 0x97fd63D049089cd70D9D139ccf9338c81372DE68; // PriceFeed Oracle Contract
    uint public fee;
    bool public entrance;
    //uint public sentValue;
    address public manager;
    // uint public deadline;
    string public description;
    
    //mapping(address => uint) public tokenProportions;

    address[] public tokenList = [
        // Sepolia
        //0x8a0E31de20651fe58A369fD6f76c21A8FF7f8d42, // LINK
        //0xf864F011C5A97fD8Da79baEd78ba77b47112935a, // WBTC
        //0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92 // WETH
        // Mainnet
        0x514910771AF9Ca656af840dff83E8264EcF986CA, // LINK
        0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, // WBTC
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, // WETH
        0x6B175474E89094C44Da98b954EedeAC495271d0F // DAI
    ];

    address denAsset = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    string symbol_ = "TKN";
    address public _swapperAddr = 0x5E5713a0d915701F464DEbb66015adD62B2e6AE9;

    mapping(address => uint256) public contributors;
    uint public noOfContributors;
    //uint public totaltSupply();

    address[] public investors;

    struct Transaction {
        uint transactionType;
        uint value;
        address transferTo;
        address tokenIn;
        address tokenOut;
        address from_;
        uint256 timestamp;
    }

    mapping(uint => Transaction) public transactions;

    uint public numTransactions;

    constructor (
        string memory name_,
        string memory description_,
        address admin,
        uint fee_
    ) ERC20 (name_, symbol_){
        _transferOwnership(admin);
        entrance = true;
        manager = admin;
        fee = fee_;
        priceConsumer = PriceConsumerV3(priceConsumerAddress);
        description = description_;
    }

    modifier onlyHolder() {
        require(balanceOf(msg.sender) > 0 || msg.sender == owner());
        _;
    }

    modifier notShares(address _asset) {
        require(_asset != address(this), "cannot act on shares");
        _;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Events
    event ContributeEvent(address _sender, uint _value);
    event TransactionEvent(string _name, uint256 _aum, address _manager, uint256 _members);

    ////////////////////////////////////////////////////////////////////////////
    // Receive function
    receive() external payable {}

    ////////////////////////////////////////////////////////////////////////////
    // Public functions

    function setEntrance() public {
        entrance = !entrance;
    }

    // This function will burn the native tokens in exchange for the denomination asset (DAI)
    // For doing this the tokens held by the defund will be swapped to denAsset 
    // preserving it proportions.
    function burnTokens(uint256 _amount) public onlyHolder {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient funds");

        // Calculate the total AUM of the DeFund
        uint256 totalAum = calculateTotalAum();

        require(totalAum > 0, "Total AUM must be greater than 0");

        // Transfer the proportional amount of each token to the investor
        for (uint256 i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            uint256 amountToSwapPrice = (_amount * getAumForToken(i)) / totalSupply();
            uint256 amountToSwap = (amountToSwapPrice * balanceForToken(token)) / calculateTotalAum();

            if (amountToSwap > 0) {
                // If the token is the same as the denAsset (dai), just transfer it directly
                if (token == denAsset) {
                    transferToken(msg.sender, amountToSwap, token);
                } else {
                    // Transfer token to swapper contract
                    transferToken(_swapperAddr, amountToSwap, token);

                    require(Swapper(_swapperAddr).balanceForToken(token) >= amountToSwap, "Insufficient funds in Swapper contract");
                    // Swap token for denAsset (dai)
                    uint256 swappedAmount = Swapper(_swapperAddr).swapInTokenToOutToken(amountToSwap, token, denAsset);

                    require(swappedAmount > 0, "Swapped amount must be greater than 0");
                    // Transfer denAsset (dai) to the sender
                    Swapper(_swapperAddr).transferToken(msg.sender, swappedAmount, denAsset);
                }
            }
        }

        // Create a new Transaction object for the burnTokens operation
        createTransaction(
            3, // Burn
            _amount,
            address(this),
            denAsset,
            denAsset,
            msg.sender
        );

        // Burn the DeFund tokens
        _burn(msg.sender, _amount);

        // Emit the event
        //emit TransactionEvent("Burn", calculateTotalAum(), manager, noOfContributors);
    }


    function rebalanceTokens(address payable _tokenInAddress, uint[] memory _valuesToSwap) public returns(uint[] memory) {
        uint[] memory valuesToSwap;
        valuesToSwap = _valuesToSwap;

        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] != _tokenInAddress && valuesToSwap[i] > 0) {
                // Transfer the portion of the tokens to the Swapper contract
                transferToken(payable(_swapperAddr), valuesToSwap[i], _tokenInAddress);
                // Call the swap funtion of Swapper tokenIn --> tokenList[i]
                Swapper(_swapperAddr).swapInTokenToOutToken(valuesToSwap[i], _tokenInAddress, tokenList[i]);
                // Transfer back the swapped tokens to the DeFund contract
                Swapper(_swapperAddr).transferToken(payable(address(this)), Swapper(_swapperAddr).balanceForToken(tokenList[i]), tokenList[i]);
            }
        }
        return (valuesToSwap);
    }

    // Transfer denomination asset to the contract. This requires an approval from the investor
    // by calling the approve function on the token contract.
    function contribute(uint amount, address payable tokenInAddress) public payable {
        require(amount > 0, "amount must be greater than 0");
        require(entrance, "entrance is closed");

        uint feeAmount = amount * fee / 100;
        uint amountAfterFee;

        if (msg.sender == manager) {
            amountAfterFee = amount;
        } else {
            amountAfterFee = amount - feeAmount;
        }

        uint[] memory valuesToSwap = _rebalance(tokenInAddress, amountAfterFee);

        tokenIn = IERC20(tokenInAddress);

        createTransaction(
            2, // contribute
            amountAfterFee,
            address(this),
            tokenInAddress,
            tokenInAddress,
            msg.sender
        );

        tokenIn.transferFrom(msg.sender, address(this), amountAfterFee);
        
        if (msg.sender != manager){
            tokenIn.transferFrom(msg.sender, manager, feeAmount);
        }
        

        uint convertedAmount = getTokenAddressPrice(tokenInAddress) * amountAfterFee / 10**8;
        _mint(msg.sender, convertedAmount);

        if(contributors[msg.sender] == 0) {
            noOfContributors++;
            investors.push(msg.sender);
        }

        contributors[msg.sender] += amountAfterFee;

        // Rebalancing the assets of the DeFund to not affect the portfolio proportions
        if (calculateTotalAum() != 0) {
            rebalanceTokens(tokenInAddress, valuesToSwap);
        }
        
        //emit ContributeEvent(msg.sender, convertedAmount);
        //emit TransactionEvent("Contribute", calculateTotalAum(), manager, noOfContributors);
    }

    // Calling the Swapper contract (ERC20 --> ERC20)
    function erc20ToErc20Transaction(uint _value, address _tokenIn, address _tokenOut) public payable onlyOwner {
        createTransaction(
            1, // Swap
            _value,
            address(this),
            _tokenIn,
            _tokenOut,
            msg.sender
        );

        // 1. Transfer the tokenIn to the swapper contract
        transferToken(payable(_swapperAddr), _value, _tokenIn);
        // 2. Swap the tokenIn for the tokenOut for the specified _value
        Swapper(_swapperAddr).swapInTokenToOutToken(_value, _tokenIn, _tokenOut);
        // 3. Transfer the tokenOut to the DeFund contract
        Swapper(_swapperAddr).transferToken(payable(address(this)), Swapper(_swapperAddr).balanceForToken(_tokenOut), _tokenOut);

        //emit TransactionEvent("Swap", calculateTotalAum(), manager, noOfContributors);
    }


    function createTransaction(
        uint8 _transactionType,
        uint256 _value,
        address _transferTo,
        address _tokenIn,
        address _tokenOut,
        address _from
    ) internal returns (uint256) {
        Transaction storage newTransaction = transactions[numTransactions];
        uint256 transactionIndex = numTransactions;
        numTransactions++;

        newTransaction.transactionType = _transactionType;
        newTransaction.value = _value;
        newTransaction.transferTo = _transferTo;
        newTransaction.tokenIn = _tokenIn;
        newTransaction.tokenOut = _tokenOut;
        newTransaction.from_ = _from;
        newTransaction.timestamp = block.timestamp;

        return transactionIndex;
    }


    function transferEth(address payable _to, uint _amount) public payable {
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool success,) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
    }

    function balanceForToken(address _tokenAddress) public view returns (uint256) {
        IERC20 _inToken = IERC20(_tokenAddress);
        return(_inToken.balanceOf(address(this)));
    }

    function transferToken(address recipient, uint amount, address _tokenAddress) public notShares(_tokenAddress) returns(bool) {
        IERC20 _inToken = IERC20(_tokenAddress);
        return(_inToken.transfer(recipient, amount));
    }

    function getSummary() public view returns (
        string memory,
        uint,
        address,
        uint
    ) {
        return (
            name(),
            calculateTotalAum(),
            manager,
            noOfContributors
        );
    }

    function getTransactionsCount() public view returns (uint) {
        return numTransactions;
    }

    // A function that returns a list of all tokens in the contract
    function getTokenList() public view returns (address[] memory) {
        return tokenList;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Calls to oracles through the priceConsumer

    function getTokenAddressPrice(address tokenAddress) view public returns (uint) {
        return priceConsumer.getPriceByTokenAddress(tokenAddress);
    }

    function getAumForToken(uint index) view public returns (uint) {
        return (getTokenAddressPrice(tokenList[index]) * balanceForToken(tokenList[index])) / 10**8;
    }

    function calculateTotalAum() view public returns (uint) {
        uint total = 0;
        uint len = tokenList.length;
        for (uint i = 0; i < len; i++) {
            total += getAumForToken(i);
        }
        return total;
    }

    function _rebalance(address _tokenIn, uint256 _amountAfterFee) view public returns(uint[] memory){
        uint256 totalAum = calculateTotalAum();
        uint[] memory valuesToSwap = new uint[](tokenList.length); // Initialize the array with the correct length

        if (totalAum == 0) {
            for (uint256 i = 0; i < tokenList.length; i++) {
                valuesToSwap[i] = 0;
            }
        } else {
            for (uint256 i = 0; i < tokenList.length; i++) {
                if (tokenList[i] != _tokenIn) {
                    uint256 tokenAum = getAumForToken(i);
                    uint256 proportion = (tokenAum * 1e18) / totalAum; // Calculate the proportion of the token with 18 decimals for precision
                    uint256 amountToSwap = (_amountAfterFee * proportion) / 1e18; // Multiply by the proportion and then divide by 1e18 to get the correct amount to swap
                    valuesToSwap[i] = amountToSwap;
                }
            }
        }
        return (valuesToSwap);
    }


}