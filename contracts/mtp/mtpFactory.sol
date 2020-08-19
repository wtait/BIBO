// pragma solidity ^0.5.12; 

// //import "./mtpStorage.sol";
// import "./mtpLib.sol";
// //import "./mtpInterface.sol";
// import "../accounts/ProxyAccountFactory.sol";

// // creates and updates mtp networks
// contract mtpFactory {

//     //emits mtpCreated events to track deployed networkds
//     event mtpNetworkCreated(address network);
//     event mtpNetworkUpgraded(address network);

//     //index of network instances
//     mapping(bytes32 => address) public mtpNetworks;

//     function registerMTPNetwork(bytes32 networkKey_, address networkAddress) private {
        
//         //create new storage instance
//         bytes32 mtpStorage = new mtpStorage();  //what type is this?
//         //create new logic instance
//         bytes32 mtpLogic = new mtpLogic();
//         //create new proxy account factory instance
//         bytes32 proxyAccountFactory = new ProxyAccountFactory();
        
//         //set the calling user as the first admin
//         mtpStorage.addAdmin(msg.sender);

//         //tie the network interface to the logic and storage instances
//         mtpInterface(mtpNetworkAddress).setStore(mtpLogic, mtpStorage);  //why do we need to have a param on mtpInterface?
//         //how do we initilize a proxyAccountFactory and set an mtpInterface instance as the thing it delegates it's calls to?
//         //could the mtp contract just inherit proxyFactory to produce proxies that delegate to the proper instance and execution context?
//         //proxyAccountFactory.setInterface(mtpInterface);

//     }
// }
