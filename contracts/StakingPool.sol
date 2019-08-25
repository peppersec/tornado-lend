pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract StakingPool is ERC20 {
  using SafeMath for uint256;

  function getBalance() public view returns(uint256 amount);
  function _send(address payable recipient, uint256 amount) internal;

  function amountFromShares(uint256 share) public pure returns(uint256) {
    return share.mul(getBalance()).div(totalSupply());
  }

  function _deposit(address account, uint256 amount) internal {
    uint256 share = totalSupply() > 0 ? amount.mul(totalSupply()).div(getBalance().sub(amount)) : amount;
    _mint(account, share);
  }

  function withdraw(uint256 share) public {
    uint256 amount = amountFromShares(share);
    _burn(msg.sender, share);
    _send(msg.sender, amount);
  }

  function withdrawAll(uint256 share) public {
    withdraw(getBalance());
  }
}
