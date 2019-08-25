
// File: contracts/interfaces/ICEther.sol

pragma solidity >=0.4.21 <0.6.0;

interface ICEther {
  function mint() external payable;
  function redeemUnderlying(uint redeemAmount) external returns (uint);
  function balanceOfUnderlying(address owner) external returns (uint);
}

// File: contracts/CEtherLendingLibraryBase.sol

pragma solidity >=0.4.21 <0.6.0;


contract CEtherLendingLibraryBase {
  ICEther public cEther;
  uint256 public lendedAmount;

  constructor(ICEther _cEther) public {
    cEther = _cEther;
  }

  function _lend(uint amount) internal returns (bool) {
    cEther.mint.value(amount)();
    // require(error == 0, 'got some error from compound');
    lendedAmount += amount;
    return true;
  }

  function _withdraw(uint amount) internal returns (bool) {
    uint error = cEther.redeemUnderlying(amount);
    if (error != 0) {
      return false;
    }
    lendedAmount -= amount;
    return true;
  }

  function interest() public returns (uint) {
    uint wholeBalance = cEther.balanceOfUnderlying(address(this));
    if (wholeBalance <= lendedAmount) {
      return 0;
    }
    return wholeBalance - lendedAmount;
  }

  function _withdrawInterest() internal returns (uint _interest) {
    _interest = interest();
    _withdraw(_interest);
  }

  function() external payable {
  }

}

// File: contracts/Wallet.sol

pragma solidity >=0.4.21 <0.6.0;



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
