// const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
// const {
//   BN, // Big Number support
//   constants, // Common constants, like the zero address and largest integers
//   expectEvent, // Assertions for emitted events
//   expectRevert // Assertions for transactions that should fail
// } = require("@openzeppelin/test-helpers");
// const { ZERO_ADDRESS } = constants;
// const truffleAssert = require("truffle-assertions");

// require("chai")
//   .use(require("chai-as-promised"))
//   .should();

// describe("Proxy accounts", () => {
//     const biboWalletContract = contract.fromArtifact("BiboWallet");
//     const mtpLibContract = contract.fromArtifact("mtpLib");
//     const mtpContract = contract.fromArtifact("mtp"); 
//     const NFTContract = contract.fromArtifact("TestNFT");
//     const cloneFactoryContract = contract.fromArtifact("Clone2Factory");
//     const [alice, bob] = accounts;
//     const saltOne = web3.utils.randomHex(12);
//     const saltTwo = web3.utils.randomHex(12);


//     beforeEach(async function() {
//         var libAddress, biboWalletAddress, mtpAddress, cloneFactoryAddress;

//         await mtpLibContract.new().then(async function(instance) {
//             libAddress = instance.address;
//             await mtpContract.detectNetwork(); 
//             mtpContract.link('mtpLib', instance.address);
//         });
//         await cloneFactoryContract.new().then(async function(instance) {
//             cloneFactoryAddress = instance.address;
//             await mtpContract.detectNetwork();
//             mtpContract.link('Clone2Factory', instance.address);
//         });
//         await biboWalletContract.new().then(async function(instance) {
//            biboWalletAddress = instance.address;
//            console.log("bibo wallet address at deploy: " + biboWalletAddress);
//         })
//         this.mtp = await mtpContract.new().then(async function(instance) {
//           mtpAddress = instance.address;
//           console.log("mtp Address at deploy: " + mtpAddress);
//           return instance;
//         });
//         //set the deployed address of the template contract that others will be cloned from
//         await this.mtp.setPublicBiboWalletAddress(biboWalletAddress);
//         //mtpAddress = await this.mtp.address;
//         this.nftokenContract = await NFTContract.new();
//         this.nfTokenAddress = await this.nftokenContract.address;
//         this.nftokenId = new BN('5042');
//         this.nft = await this.nftokenContract.mintUniqueTokenTo(alice, this.nftokenId);
//     });



//   describe("Proxy Accounts", function() {
//     it("should generate an address for biboWallet", async function() {
//       await this.mtp.createWallet(saltOne, alice);
//       let aliceBiboWallet = await this.mtp.getUserWalletAddress.call(alice);
//       console.log("alice address: " + alice);
//       //console.log("biboWallet address: " + biboWalletAddress);
//       console.log("alice bibo wallet address: " + aliceBiboWallet);
//     });
//     it("should point to mtp for implementation", async function() {
//       // let implementationAddress = await this.proxyAccount.implementation.call();
//       // implementationAddress.should.equal(this.proxyFactory.address);
//       return false;
//     });
//     it("should return address of new proxy", async function() {
//       // await this.proxyFactory.createProxy(1231221, "test", []); //don't need to call .call() to access func in truffle
//       // let proxies = await this.proxyFactory.getAllProxies();
//       // //console.log(proxies); //debug
//       // let newProxy = await ProxyAccount.at(proxies[0]);
//       // //console.log(newProxy.address); //debug
//       // //assert.equal(proxies[0], newProxy.address);
//       // proxies[0].should.equal(newProxy.address);
//       // let impl_addr = await newProxy.implementation(); //should return addr MTP
//       // //console.log(impl_addr); //debug
//       // let new_mtp = await MTP.at(impl_addr);
//       // //console.log(new_mtp.address); //debug
//       // //assert.equal(impl_addr, new_mtp.address);
//       // impl_addr.should.equal(new_mtp.address);
//       // let tokenInfo = await new_mtp.tokens(this.nftokenId);
//       // console.log(tokenInfo);
//       return false;
//     });
//   });
// });
