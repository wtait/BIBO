const MTP = artifacts.require("./MTP.sol");
const ProxyAccount = artifacts.require("./AuthereumProxy.sol");
const ProxyFactory = artifacts.require("./AuthereumProxyFactory.sol");

module.exports = async deployer => {
  await deployer.deploy(MTP);
  await deployer.deploy(ProxyFactory, MTP.address);
  await deployer.deploy(ProxyAccount, ProxyFactory.address);
};


//deployer.deploy => storage, interface, library    //deploy base contracts

        //deployer.deploy => mtpfactory(storage, interface, library)   //mtpfactory 

            //mtpfactory.newBIBOnetwork()