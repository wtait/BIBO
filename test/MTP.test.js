//const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
//const {
//BN,
//constants,
//expectEvent,
//expectRevert
//} = require("@openzeppelin/test-helpers");
//const { ZERO_ADDRESS } = constants;
//const { expect } = require("chai");

//const MTP = contract.fromArtifact("MTP");
//const NFT = contract.fromArtifact("NFT");
//const ProxyFactory = contract.fromArtifact("AuthereumProxyFactory");
//const Proxy = contract.fromArtifact("AuthereumProxy");

//describe("Minimal Viable Test for MTP and proxies", function() {
//const [alice, bob, owner] = accounts;
//const name = "NonFungibleToken";
//const symbol = "NFT";
//const firstTokenId = new BN(100);
//const secondTokenId = new BN(200);

//beforeEach(async function() {
//this.token = await NFT.new({ from: alice });
//await this.token.initialize(name, symbol);
//this.mtp = await MTP.new({ from: owner });
//const mtp_address = await this.mtp.address;
//this.factory = await ProxyFactory.new({ from: owner });
//await this.factory.initialize(mtp_address, { from: owner });
//await this.factory.createProxy(new BN(100), { from: bob });
//let proxies = await this.factory.getAllProxies();
//this.bob_proxy = await Proxy.at(proxies[0]);
//});

//describe("ERC721 functions", function() {
//beforeEach(async function() {
//await this.token.mint(alice, firstTokenId);
//await this.token.mint(alice, secondTokenId);
//await this.token.safeTransferFrom(alice, bob, firstTokenId, {
//from: alice
//});
//await this.token.increment(firstTokenId, { from: bob });
//});
//it("create token", async function() {
//expect(await this.token.balanceOf(alice)).to.be.bignumber.equal("1");
//expect(await this.token.ownerOf(secondTokenId)).to.equal(alice);
//});
//it("send token", async function() {
//expect(await this.token.balanceOf(bob)).to.be.bignumber.equal("1");
//expect(await this.token.ownerOf(firstTokenId)).to.equal(bob);
//});
//it("access token function", async function() {
//expect(await this.token.getCounts(firstTokenId)).to.be.bignumber.equal(
//"1"
//);
//expect(await this.token.getCounts(secondTokenId)).to.be.bignumber.equal(
//"0"
//);
//});
//it("deploy mtp and factory", async function() {
//expect(await this.factory.owner()).to.equal(owner);
//});
//it("bob creates a proxy through factory", async function() {
//const bob_mtp_impl = await this.bob_proxy.implementation();
//});
//});
//});
