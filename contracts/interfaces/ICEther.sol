pragma solidity >=0.4.21 <0.6.0;

interface ICEther {

    function mint() external payable returns (uint);

    function redeem(uint redeemTokens) external returns (uint);

    function balanceOfUnderlying(address owner) external view returns (uint);
}