pragma solidity ^0.5.0;

import "StakingPool.sol";

contract EthStakingPool is StakingPool {
  function () external payable { }

  function deposit() public payable {
    _deposit(msg.sender, msg.value);
  }

  function _getBalance() internal view returns(uint256 amount) {
    return address(this).balance;
  }

  function _send(address payable recipient, uint256 amount) internal {
    recipient.transfer(amount);
  }
}