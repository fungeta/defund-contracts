// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

interface Wrapper {
    function deposit() external payable;
    function withdraw(uint wad) external;
    function totalSupply() external view returns (uint);
    function approve(address guy, uint wad) external returns (bool);
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
}

contract Swapper {
    address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    //address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    //address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    //address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;// No funciona
    //address public constant WMATIC = 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0;
    //address public constant UNI = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
    //address public constnat USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7; // No funciona

    uint24 public constant poolFee = 3000;

    constructor() {}

    fallback() external payable {}
    receive() external payable {}

    function swapInTokenToOutToken(uint256 amountIn, address _in, address _out) external returns (uint256 amountOut) {
        IERC20 _inToken = IERC20(_in);
        _inToken.approve(address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _in,
                tokenOut: _out,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = swapRouter.exactInputSingle(params);

        return(amountOut);
    }

    function balanceForToken(address _tokenAddress) external view returns (uint256) {
        IERC20 _inToken = IERC20(_tokenAddress);
        return(_inToken.balanceOf(address(this)));
    }

    function transferToken(address recipient, uint256 amount, address _tokenAddress) external returns(bool) {
        IERC20 _inToken = IERC20(_tokenAddress);
        return(_inToken.transfer(recipient, amount));
    }

    function transferEth(address payable _to, uint256 _amount) public payable {
        (bool sent,) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function unwrapEth(address payable _wrapper, uint256 _amount) public payable {
        Wrapper(_wrapper).withdraw(_amount);
    }
}