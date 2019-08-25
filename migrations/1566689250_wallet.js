const wallet = artifacts.require("Wallet");
const pool = artifacts.require("EthStakingPool");

module.exports = function(deployer) {
  deployer.then(async () => {
    const result = await deployer.deploy(wallet, "0x42a628e0c5f3767930097b34b08dcf77e78e4f2b", '100000000000000000', (await pool.deployed()).address);
    console.log("Wallet address:", result.address);
  });
};
