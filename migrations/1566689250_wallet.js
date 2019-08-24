const wallet = artifacts.require("Wallet");
const compound = artifacts.require("CEtherLendingLibraryBase");
const pool = artifacts.require("EthStakingPool");

module.exports = function(deployer) {
  deployer.then(async () => {
    const result = await deployer.deploy(wallet, (await compound.deployed()).address, '100000000000000000', (await pool.deployed()).address);
    console.log("Wallet address:", result.address);
  });
};
