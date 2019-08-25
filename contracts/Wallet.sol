pragma solidity >=0.4.21 <0.6.0;

import './CEtherLendingLibraryBase.sol';
import './interfaces/ICEther.sol';

contract Wallet is CEtherLendingLibraryBase {
  address payable public pool;
  uint public denomination;
  mapping(address => bool) public deposits;

  constructor (ICEther _cEther, uint _denomination, address payable _pool) CEtherLendingLibraryBase(_cEther) public {
    pool = _pool;
    denomination = _denomination;
  }

  function enter() public payable {
    require(msg.value == denomination, "provide the required value");
    deposits[msg.sender] = true;
    _lend(msg.value);
    emit Debug(msg.sender, deposits[msg.sender]);
  }

  event Debug(address who, bool done);

  function exit() public {
    require(deposits[msg.sender], "there is no deposits to withdraw");
    deposits[msg.sender] = false;
    _withdraw(denomination);
    msg.sender.transfer(denomination);
  }

  function withdrawInterest() public {
    uint interest = _withdrawInterest();
    pool.transfer(interest);
  }
}
