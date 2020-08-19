const mtpLib = artifacts.require("./mtpLib.sol")
const MTP = artifacts.require("./mtp.sol");
const ProxyAccount = artifacts.require("./ProxyAccount.sol");
const ProxyFactory = artifacts.require("./ProxyAccountFactory.sol");

// module.exports = function (deployer) {
//   deployer.deploy(mtpLib).then(() => {
//       deployer.deploy(MTP);
//   });
//   deployer.link(mtpLib, MTP);
// };



module.exports = async deployer => {
  // await deployer.deploy(mtpLib);
  await deployer.deploy(MTP);
  // await deployer.link(mtpLib, MTP);
  // await deployer.deploy(ProxyFactory, MTP.address);
  // await deployer.deploy(ProxyAccount, ProxyFactory.address);
};


//deployer.deploy => storage, interface, library    //deploy base contracts

        //deployer.deploy => mtpfactory(storage, interface, library)   //mtpfactory 

            //mtpfactory.newBIBOnetwork()