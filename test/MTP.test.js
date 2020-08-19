const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = constants;
const truffleAssert = require("truffle-assertions");

require("chai")
  .use(require("chai-as-promised"))
  .should();

  function getSalt() {
    return web3.utils.randomHex(12);
  }

describe("MTP logic ", () => {
    const biboWalletContract = contract.fromArtifact("BiboWallet");
    const mtpLibContract = contract.fromArtifact("mtpLib");
    const MtpContract = contract.fromArtifact("mtp"); 
    const NFTContract = contract.fromArtifact("TestNFT");
    const cloneFactoryContract = contract.fromArtifact("Clone2Factory");
    const [alice, bob] = accounts;
    var salt = getSalt();

    let   biboWalletAddress;
    var mtpAddress;


    beforeEach(async function() {
        var libAddress, cloneFactoryAddress;
        // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
        var retVal = 0x150b7a02;
        //var mtpAdress;

        await mtpLibContract.new().then(async function(instance) {
            libAddress = instance.address;
            await MtpContract.detectNetwork(); 
            MtpContract.link('mtpLib', instance.address);
        });
        await cloneFactoryContract.new().then(async function(instance) {
            cloneFactoryAddress = instance.address;
            await MtpContract.detectNetwork();
            MtpContract.link('Clone2Factory', instance.address);
        });
        await biboWalletContract.new(retVal, false).then(async function(instance) {
           biboWalletAddress = instance.address;
           console.log("bibo wallet address at deploy: " + biboWalletAddress);
        });
        this.mtpContract = await MtpContract.new();
        //await deployer.deploy(MtpContract);
        this.mtpContract = await MtpContract.new();
        console.log(this.mtpContract.methods);
        //await this.mtpContract.test();
        await this.mtpContract.setPublicBiboWalletAddress(biboWalletAddress);
        // .then(async function(instance) {
        //   mtpAddress = instance.address;
        //   console.log("mtp Address at deploy: " + mtpAddress);
        //   //console.log(instance);
        //   //return instance;
        // });
        
        //set the deployed address of the template contract that others will be cloned from
        
        mtpAddress = await this.mtpContract.address;
        console.log("mtp contract address is: " + mtpAddress);
        this.nftokenContract = await NFTContract.new();
        this.nfTokenAddress = await this.nftokenContract.address
        this.nftokenId = new BN('5042');
        this.nft = await this.nftokenContract.mintUniqueTokenTo(alice, this.nftokenId);
    });

    describe("NFT Transfers", function() {

        it("should be able to deposit a token from an EOA to a biboWallet account", async function() {    
          
          await this.mtpContract.createWallet(salt, alice);
          salt = await getSalt();
          let aliceBiboWallet = await this.mtpContract.getUserWalletAddress.call(alice);
          let aliceWalletContract = await biboWalletContract.at(aliceBiboWallet);
          await aliceWalletContract.intitialize(alice, mtpAddress);
          let owner = await this.nftokenContract.ownerOf(this.nftokenId);
          owner.should.equal(alice);
          await this.nftokenContract.setApprovalForAll(mtpAddress, true, { from: alice });
          await this.mtpContract.depositToken(this.nfTokenAddress, alice, aliceBiboWallet, this.nftokenId);
          owner = await this.nftokenContract.ownerOf(this.nftokenId);
          owner.should.equal(aliceBiboWallet);
        });
        it("should be able to transfer an nft from one bibo wallet to another", async function() {
          
          await this.mtpContract.createWallet(salt, alice);
          salt = await getSalt();
          let aliceBiboWallet = await this.mtpContract.getUserWalletAddress.call(alice);
          let aliceWalletContract = await biboWalletContract.at(aliceBiboWallet);
          await aliceWalletContract.intitialize(alice, mtpAddress);
          await this.mtpContract.createWallet(salt, bob);
          let bobBiboWallet = await this.mtpContract.getUserWalletAddress.call(bob);
          let owner = await this.nftokenContract.ownerOf(this.nftokenId);
          owner.should.equal(alice);

          await this.nftokenContract.setApprovalForAll(mtpAddress, true, { from: alice });
          let mtpIsOperator = await this.nftokenContract.isApprovedForAll(alice, mtpAddress);
          mtpIsOperator.should.be.true;
          await this.mtpContract.depositToken(this.nfTokenAddress, alice, aliceBiboWallet, this.nftokenId);
          owner = await this.nftokenContract.ownerOf(this.nftokenId);
          owner.should.equal(aliceBiboWallet);

          await aliceWalletContract.approved(this.nftokenContract.address, mtpAddress);
          aliceWalletOperator = await this.nftokenContract.isApprovedForAll(aliceBiboWallet, mtpAddress);
          aliceWalletOperator.should.be.true;
          await this.mtpContract.mtpTransfer(this.nfTokenAddress, aliceBiboWallet, bobBiboWallet, this.nftokenId);
          let newOwner = await this.nftokenContract.ownerOf(this.nftokenId);
          newOwner.should.equal(bobBiboWallet);
        });

        it('should update balances on transfer', async function() {
                  
          let balanceAlice = await this.mtpContract.getBalance.call(alice);
          let balanceBob = await this.mtpContract.getBalance.call(bob);
          balanceBob = balanceBob.toNumber();
          balanceAlice = balanceAlice.toNumber();
          balanceAlice.should.equal(0);
          balanceBob.should.equal(0);

          await this.mtpContract.createWallet(salt, alice);
          salt = await getSalt();
          let aliceBiboWallet = await this.mtpContract.getUserWalletAddress.call(alice);
          let aliceWalletContract = await biboWalletContract.at(aliceBiboWallet);
          await aliceWalletContract.intitialize(alice, mtpAddress);
          await this.mtpContract.createWallet(salt, bob);
          let bobBiboWallet = await this.mtpContract.getUserWalletAddress.call(bob);
          let owner = await this.nftokenContract.ownerOf(this.nftokenId);
          owner.should.equal(alice);

          await this.nftokenContract.setApprovalForAll(mtpAddress, true, { from: alice });
          let mtpIsOperator = await this.nftokenContract.isApprovedForAll(alice, mtpAddress);
          mtpIsOperator.should.be.true;
          await this.mtpContract.depositToken(this.nfTokenAddress, alice, aliceBiboWallet, this.nftokenId);
          owner = await this.nftokenContract.ownerOf(this.nftokenId);
          owner.should.equal(aliceBiboWallet);
          
          await aliceWalletContract.approved(this.nftokenContract.address, mtpAddress);
          aliceWalletOperator = await this.nftokenContract.isApprovedForAll(aliceBiboWallet, mtpAddress);
          aliceWalletOperator.should.be.true;
          await this.mtpContract.mtpTransfer(this.nfTokenAddress, aliceBiboWallet, bobBiboWallet, this.nftokenId);
          let newOwner = await this.nftokenContract.ownerOf(this.nftokenId);
          newOwner.should.equal(bobBiboWallet);





            // await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: alice});
            // await this.mtp.mtpTransfer(this.nfTokenAddress, bob, this.nftokenId, {from: alice});


            // balanceAlice = await this.mtp.getBalance.call(alice);
            // balanceBob = await this.mtp.getBalance.call(bob);
            // balanceAlice = balanceAlice.toNumber();
            // balanceBob = balanceBob.toNumber();
            // balanceAlice.should.equal(1);
            // balanceBob.should.equal(-1);

        });
        // it('should create a proxy address for users', async function() {
        //   let aliceProxy = null;

        // })
    //     it('should add a Token struct to nftokens mapping when a new token is staked', async function() {
    //         await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: alice});
    //         await this.mtp.nfMTPTransfer(this.nfTokenAddress, bob, this.nftokenId, {from: alice});
    //         const newTokenStruct = await this.mtp.nftokens.call(this.nftokenId);
    //         const newTokenId = newTokenStruct.token_id_.toNumber();
    //         newTokenId.should.equal(this.nftokenId.toNumber());
    //     });
    //     it('should keep bibo total supply at 0 after transfers',async function() {
    //         let stakeChains = [];
    //         for(i = 0; i < accounts.length - 1; i++) {
    //             let sender = accounts[i];
    //             let receiver = accounts[i + 1];
    //             await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: sender});
    //             await this.mtp.nfMTPTransfer(this.nfTokenAddress, receiver, this.nftokenId, {from: sender});
    //             let stakeChain = [];

    //             let numStakers = await this.mtp.getStakeChainLength.call(this.nftokenId);
    //             let n = 0;
    //             while(n < numStakers) {
    //                 let currentStakerAddress = await this.mtp.stakeChains.call(this.nftokenId, n);
    //                 stakeChain.push(currentStakerAddress);
    //                 n++;
    //             }
    //             stakeChains.push(stakeChain);
    //         }

    //         let lastChain = stakeChains[stakeChains.length - 1];
            
    //         for(i = 0; i < lastChain.length; i++) {
    //             let address = lastChain[i];
    //             let balance = await this.mtp.balances.call(address);
    //             lastChain[i] = {"address": address, "balance": balance.toNumber()};
    //         }

    //         let biboTotalSupply = lastChain.reduce(function(total, account) {
    //             total += account.balance;
    //             return total;
    //         }, 0);

    //         biboTotalSupply.should.equal(0);
    //     });
    });

});

