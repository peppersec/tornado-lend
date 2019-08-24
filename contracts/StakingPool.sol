pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract StakingPool is ERC20 {
  using SafeMath for uint256;

  function _getBalance() internal view returns(uint256 amount);
  function _send(address payable recipient, uint256 amount) internal;

  function _deposit(address account, uint256 amount) internal {
    uint256 share = totalSupply() > 0 ? amount.mul(totalSupply()).div(_getBalance()) : amount;
    _mint(account, share);
  }

  function withdraw(address payable account, uint256 share) public {
    uint256 amount = share.mul(_getBalance()).div(totalSupply());
    _burn(account, share);
    _send(account, amount);
  }
}



