pragma solidity >=0.4.21 <0.6.0;

import './CEtherLendingLibraryBase.sol';
import './interfaces/ICEther.sol';

contract Wallet is CEtherLendingLibraryBase {
    address payable public owner;
    uint public denomination;
    mapping(address => bool) public deposits;

    modifier onlyOwner() {
      require(msg.sender == owner, "only owner method");
      _;
    }

    constructor (ICEther _cEther, uint _denomination) CEtherLendingLibraryBase(_cEther) public {
      owner = msg.sender;
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

    function withdrawInterest() public onlyOwner {
      uint interest = _withdrawInterest();
      owner.transfer(interest);
    }
}
