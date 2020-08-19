// /* global accounts */
// // const ethers = require("ethers");

// //using oz test environment and helpers
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

//   // describe("MTP logic ", () => {
//   //   const biboWalletContract = contract.fromArtifact("BiboWallet");
//   //   const mtpLibContract = contract.fromArtifact("mtpLib");
//   //   const mtpContract = contract.fromArtifact("mtp"); 
//   //   const NFTContract = contract.fromArtifact("TestNFT");
//   //   const cloneFactoryContract = contract.fromArtifact("Clone2Factory");
//   //   const [alice, bob] = accounts;


// const Proxy = contract.fromArtifact("Proxy");
// const BaseWallet = contract.fromArtifact("BaseWallet");
// const Registry = contract.fromArtifact("ModuleRegistry");

// const GuardianStorage = contract.fromArtifact("GuardianStorage");
// const NftModule = contract.fromArtifact("NftTransfer");

// const ERC721 = contract.fromArtifact("TestERC721");
// const CK = contract.fromArtifact("CryptoKittyTest");
// //const ERC20 = contract.fromArtifact("TestERC20");
// const ERC20Approver = contract.fromArtifact("ERC20Approver");

// //const ZERO_BYTES32 = ethers.constants.HashZero;

// //const TestManager = require("../utils/test-manager");
// //const { parseRelayReceipt } = require("../utils/utilities.js");

// describe("Token Transfer", function () {
//   this.timeout(10000);

//   //const manager = new TestManager();

//   const owner1 = accounts[1].signer;
//   const owner2 = accounts[2].signer;
//   const eoaRecipient = accounts[3].signer;
//   const tokenId = 1;

//   let deployer;
//   let nftModule;
//   let walletImplementation;
//   let wallet1;
//   let wallet2;
//   let erc721;
//   let ck;
//   let ckId;
//   let erc20;
//   let erc20Approver;

//   before(async () => {
//     //deployer = manager.newDeployer();
//     //const registry = await deployer.deploy(Registry);
//     const registry = await Registry.new().then(async function(instance) {registry.address = instance.address;});
//     console.log("registry address: " + registry.contractAddress)
//     walletImplementation = await BaseWallet.new();

//     const guardianStorage = await GuardianStorage.new();
//     ck = await CK.new();
//     nftModule = await NftModule.new(registry.contractAddress, guardianStorage.contractAddress, ck.contractAddress).then(async function(instance) {
//       erc20Approver = await ERC20Approver.new(registry.contractAddress);
//     });
    
//   //   deployer.deploy(NftModule, {},
//   //     registry.contractAddress,
//   //     guardianStorage.contractAddress,
//   //     ck.contractAddress);
//   //   erc20Approver = await deployer.deploy(ERC20Approver, {}, registry.contractAddress);
//   });

//   // this.mtp = await mtpContract.new().then(async function(instance) {
//   //   mtpAddress = instance.address;
//   //   console.log("mtp Address at deploy: " + mtpAddress);
//   //   return instance;
//   // });

//   beforeEach(async () => {
//     const proxy1 = await deployer.deploy(Proxy, {}, walletImplementation.contractAddress);
//     wallet1 = deployer.wrapDeployedContract(BaseWallet, proxy1.contractAddress);
//     const proxy2 = await deployer.deploy(Proxy, {}, walletImplementation.contractAddress);
//     wallet2 = deployer.wrapDeployedContract(BaseWallet, proxy2.contractAddress);

//     await wallet1.init(owner1.address, [nftModule.contractAddress, erc20Approver.contractAddress]);
//     await wallet2.init(owner2.address, [nftModule.contractAddress]);
//     erc721 = await deployer.deploy(ERC721);
//     await erc721.mint(wallet1.contractAddress, tokenId);
//   });


//   describe("NFT transfers", () => {
//     async function testNftTransfer({
//       safe = true, relayed, recipientAddress, nftContract = erc721, nftId = tokenId, shouldSucceed = true, expectedError,
//     }) {
//       const beforeWallet1 = await nftContract.balanceOf(wallet1.contractAddress);
//       const beforeRecipient = await nftContract.balanceOf(recipientAddress);
//       if (relayed) {
//         const txReceipt = await manager.relay(nftModule, "transferNFT",
//           [wallet1.contractAddress, nftContract.contractAddress, recipientAddress, nftId, safe, ZERO_BYTES32], wallet1, [owner1]);
//         const { success, error } = parseRelayReceipt(txReceipt);
//         assert.equal(success, shouldSucceed);
//         if (!shouldSucceed) {
//           assert.equal(error, expectedError);
//         }
//       } else {
//         const txPromise = nftModule.from(owner1)
//           .transferNFT(wallet1.contractAddress, nftContract.contractAddress, recipientAddress, nftId, safe, ZERO_BYTES32);
//         if (shouldSucceed) {
//           await txPromise;
//         } else {
//           assert.revert(txPromise);
//         }
//       }
//       if (shouldSucceed) {
//         const afterWallet1 = await nftContract.balanceOf(wallet1.contractAddress);
//         const afterRecipient = await nftContract.balanceOf(recipientAddress);
//         assert.equal(beforeWallet1.sub(afterWallet1).toNumber(), 1, `wallet1 should have one less NFT (safe: ${safe}, relayed: ${relayed})`);
//         assert.equal(afterRecipient.sub(beforeRecipient).toNumber(), 1, `recipient should have one more NFT (safe: ${safe}, relayed: ${relayed})`);
//       }
//     }

//     describe("transfer to EOA account", () => {
//       it("should allow unsafe NFT transfer from wallet1 to an EOA account", async () => {
//         await testNftTransfer({ safe: false, relayed: false, recipientAddress: eoaRecipient.address });
//       });

//       it("should allow safe NFT transfer from wallet1 to an EOA account", async () => {
//         await testNftTransfer({ safe: true, relayed: false, recipientAddress: eoaRecipient.address });
//       });


//       it("should allow unsafe NFT transfer from wallet1 to an EOA account (relayed)", async () => {
//         await testNftTransfer({ safe: false, relayed: true, recipientAddress: eoaRecipient.address });
//       });

//       it("should allow safe NFT transfer from wallet1 to an EOA account (relayed)", async () => {
//         await testNftTransfer({ safe: true, relayed: true, recipientAddress: eoaRecipient.address });
//       });
//     });

//     describe("transfer to other wallet", () => {
//       it("should allow unsafe NFT transfer from wallet1 to wallet2", async () => {
//         await testNftTransfer({ safe: false, relayed: false, recipientAddress: wallet2.contractAddress });
//       });

//       it("should allow safe NFT transfer from wallet1 to wallet2", async () => {
//         await testNftTransfer({ safe: true, relayed: false, recipientAddress: wallet2.contractAddress });
//       });

//       it("should allow unsafe NFT transfer from wallet1 to wallet2 (relayed)", async () => {
//         await testNftTransfer({ safe: false, relayed: true, recipientAddress: wallet2.contractAddress });
//       });

//       it("should allow safe NFT transfer from wallet1 to wallet2 (relayed)", async () => {
//         await testNftTransfer({ safe: true, relayed: true, recipientAddress: wallet2.contractAddress });
//       });
//     });

//     describe("CK transfer", () => {
//       beforeEach(async () => {
//         await ck.createDumbKitty(wallet1.contractAddress);
//         ckId = (ckId === undefined) ? 0 : ckId + 1; // update the id of the CryptoKitty that was just created
//       });

//       it("should allow CK transfer from wallet1 to wallet2", async () => {
//         await testNftTransfer({
//           relayed: false, nftId: ckId, nftContract: ck, recipientAddress: wallet2.contractAddress,
//         });
//       });

//       it("should allow CK transfer from wallet1 to wallet2 (relayed)", async () => {
//         await testNftTransfer({
//           relayed: true, nftId: ckId, nftContract: ck, recipientAddress: wallet2.contractAddress,
//         });
//       });

//       it("should allow CK transfer from wallet1 to EOA account", async () => {
//         await testNftTransfer({
//           relayed: false, nftId: ckId, nftContract: ck, recipientAddress: eoaRecipient.address,
//         });
//       });

//       it("should allow CK transfer from wallet1 to EOA account (relayed)", async () => {
//         await testNftTransfer({
//           relayed: true, nftId: ckId, nftContract: ck, recipientAddress: eoaRecipient.address,
//         });
//       });
//     });

//     describe("Protecting from transferFrom hijacking", () => {
//       beforeEach(async () => {
//         erc20 = await deployer.deploy(ERC20, {}, [wallet1.contractAddress], 1000, 18);
//         await erc20Approver.from(owner1).approveERC20(
//           wallet1.contractAddress,
//           erc20.contractAddress,
//           wallet1.contractAddress, // spender
//           100,
//         ); // amount
//       });

//       it("should NOT allow ERC20 transfer from wallet1 to wallet2", async () => {
//         await testNftTransfer({
//           shouldSucceed: false, safe: false, relayed: false, nftId: 100, nftContract: erc20, recipientAddress: wallet2.contractAddress,
//         });
//       });

//       it("should NOT allow ERC20 transfer from wallet1 to wallet2 (relayed)", async () => {
//         await testNftTransfer({
//           shouldSucceed: false,
//           expectedError: "NT: Non-compliant NFT contract",
//           safe: false,
//           relayed: true,
//           nftId: 100,
//           nftContract: erc20,
//           recipientAddress: wallet2.contractAddress,
//         });
//       });
//     });
//   });
// });