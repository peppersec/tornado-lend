pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "StakingPool.sol";

contract ERC20StakingPool is StakingPool {
  IERC20 public token;

  constructor(IERC20 _token) public {
    token = _token;
  }

  function deposit(uint256 amount) public payable {
    token.transferFrom(msg.sender, address(this), amount);
  }

  function _getBalance() internal view returns(uint256 amount) {
    return token.balanceOf(address(this));
  }

  function _send(address payable recipient, uint256 amount) internal {
    token.transfer(recipient, amount);
  }
}