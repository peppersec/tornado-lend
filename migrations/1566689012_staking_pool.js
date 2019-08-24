const pool = artifacts.require("EthStakingPool");

module.exports = function(deployer) {
  deployer.deploy(pool);
};
