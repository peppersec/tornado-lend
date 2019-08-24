const compound = artifacts.require("CEtherLendingLibraryBase");

module.exports = function(deployer) {
  deployer.deploy(compound, '0x42a628e0c5f3767930097b34b08dcf77e78e4f2b')
};
