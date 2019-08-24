pragma solidity >=0.4.21 <0.6.0;

interface ICEther {

    function mint() external payable;

    function redeemUnderlying(uint redeemAmount) external returns (uint);

    function balanceOfUnderlying(address owner) external returns (uint);
}
