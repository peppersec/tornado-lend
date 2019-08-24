pragma solidity >=0.4.21 <0.6.0;

import './interfaces/ICEther.sol';

contract CEtherLendingLibraryBase {
    ICEther public cEther;
    uint256 public lendedAmount;

    constructor(ICEther _cEther) public {
        cEther = _cEther;
    }

    function _lend(uint amount) internal returns(bool) {
        cEther.mint.value(amount)();
        // require(error == 0, 'got some error from compound');
        lendedAmount += amount;
        return true;
    }

    function _withdraw(uint amount) internal returns(bool) {
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

    function _withdrawInterest() internal returns(uint _interest) {
        _interest = interest();
        _withdraw(_interest);
    }

    function() external payable {
    }

}
