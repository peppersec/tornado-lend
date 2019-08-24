pragma solidity >=0.4.21 <0.6.0;

import './CEtherLendingLibraryBase.sol';
import './interfaces/ICEther.sol';

contract ParentProjectExample is CEtherLendingLibraryBase {
    address payable public owner;
    uint public denomination;
    mapping(address => bool) deposits;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner method");
        _;
    }

    constructor (ICEther _cEther) CEtherLendingLibraryBase(_cEther) public {
        owner = msg.sender;
    }

    function enter() public payable {
        require(msg.value == denomination, "provide the required value");
        deposits[msg.sender] = true;
        _lend(msg.value);
    }

    function exit() public {
        require(deposits[msg.sender], "there is no deposits to withdraw");
        deposits[msg.sender] = false;
        _withdraw(denomination);
    }

    function withdrawInterest() public onlyOwner {
        uint interest = _withdrawInterest();
        owner.transfer(interest);
    }
}