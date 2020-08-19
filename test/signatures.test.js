// const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
// const EthCrypto = require("eth-crypto");
// const VerifySigContract = contract.fromArtifact("VerifySig");


// require("chai")
//   .use(require("chai-as-promised"))
//   .should();

// describe("signature verification", () => {
//     const signerIdentity = EthCrypto.createIdentity();
//     const signerPublicKey = signerIdentity.address;

//     const message = EthCrypto.hash.keccak256([
//         { type: "uint256", value: "5" },
//         { type: "string", value: "Banana" }
//       ]);
//     const signature = EthCrypto.sign(signerIdentity.privateKey, message);
//     console.log(`message: ${message}`);
//     console.log(`signature: ${signature}`);
//     console.log(`signer public key: ${signerPublicKey}`);

//     beforeEach(async function() {

//         this.verifySigContract = await VerifySigContract.new(signerPublicKey);

//     });

//     describe("signature recovery", function() {
//         it("should return false when invalid message is verified", async function() {
//             let verificationResponse = await this.verifySigContract.isValidData(6, "Banana", signature);
//             verificationResponse.should.equal(false);
//         })
       
//         it("should return when asked true when asked to verify valid data", async function() {
//             let verificationResponse = await this.verifySigContract.isValidData(5, "Banana", signature);
//             verificationResponse.should.equal(true);
//         })
//     })



// })

