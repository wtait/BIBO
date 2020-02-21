const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = constants;

require("chai")
  .use(require("chai-as-promised"))
  .should();

describe("Proxy accounts", () => {
  const MTP = contract.fromArtifact("MTP");
  const NFTContract = contract.fromArtifact("TestNFT");
  const [alice, bob] = accounts;
  const ProxyFactory = contract.fromArtifact("AuthereumProxyFactory");
  const ProxyAccount = contract.fromArtifact("AuthereumProxy");

  beforeEach(async function() {
    this.mtp = await MTP.new();
    this.mtpAddress = await this.mtp.address;
    this.nftokenContract = await NFTContract.new();
    this.nfTokenAddress = await this.nftokenContract.address;
    this.nftokenId = new BN("5042");
    this.nft = await this.nftokenContract.mintUniqueTokenTo(
      alice,
      this.nftokenId
    );
    await this.mtp.depositToken(this.nfTokenAddress, alice, this.nftokenId);
    this.proxyFactory = await ProxyFactory.new(this.mtpAddress);
    this.proxyAccount = await ProxyAccount.new(this.proxyFactory.address);
    // console.log(
    //     "mtp address: " + this.mtpAddress + '\n' +
    //     "proxy Factory address: " + this.proxyFactory.address + '\n' +
    //     'proxy account address: ' + this.proxyAccount.address
    //);
  });

  describe("Proxy Accounts", function() {
    it("should deploy a proxy account", async function() {
      //console.log(this.mtpAddress);
      let ProxyAccountAddress = this.proxyAccount.address;
      ProxyAccountAddress.should.be.an("string").that.includes("0x");
    });
    it("should point to mtp for implementation", async function() {
      let implementationAddress = await this.proxyAccount.implementation.call();
      implementationAddress.should.equal(this.proxyFactory.address);
    });
    it("should return address of new proxy", async function() {
      let newProxyAddress = await this.proxyFactory.createProxy.call(
        1,
        "test",
        []
      );
      console.log(newProxyAddress);
    });
  });
});

