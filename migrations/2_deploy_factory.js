const MTP = artifacts.require("./MTP.sol");
const Proxy = artifacts.require("./AuthereumProxy.sol");
const Factory = artifacts.require("./AuthereumProxyFactory.sol");

module.exports = async deployer => {
  await deployer.deploy(MTP);
  await deployer.deploy(Proxy, MTP.address);
  await deployer.deploy(Factory, Proxy.address);
};
