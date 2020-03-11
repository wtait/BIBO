const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = constants;
const { expect } = require("chai");

const MTP = contract.fromArtifact("StandaloneMTP");
const NFT = contract.fromArtifact("NFT");

describe("StandaloneMTP", function() {
  const [alice, bob, owner] = accounts;
  const name = "NonFungibleToken";
  const symbol = "NFT";
  const firstTokenId = new BN(100);
  const secondTokenId = new BN(200);

  beforeEach(async function() {
    this.token = await NFT.new({ from: alice });
    this.mtp = await MTP.new({ from: owner });
    await this.token.initialize(name, symbol, { from: alice });
    await this.mtp.initialize({ from: owner });
  });

  describe("StandaloneMTP", function() {
    beforeEach(async function() {
      await this.token.mint(alice, firstTokenId, { from: alice });
      await this.token.mint(alice, secondTokenId, { from: alice });
      await this.token.safeTransferFrom(alice, bob, firstTokenId, {
        from: alice
      });
      await this.token.increment(firstTokenId, { from: bob });
      await this.token.addByNumber(secondTokenId, 5, { from: alice });
    });
    it("create token", async function() {
      expect(await this.token.balanceOf(alice)).to.be.bignumber.equal("1");
      expect(await this.token.ownerOf(secondTokenId)).to.equal(alice);
    });
    it("send token", async function() {
      expect(await this.token.balanceOf(bob)).to.be.bignumber.equal("1");
      expect(await this.token.ownerOf(firstTokenId)).to.equal(bob);
    });
    it("access token function", async function() {
      expect(await this.token.getCounts(firstTokenId)).to.be.bignumber.equal(
        "1"
      );
      expect(await this.token.getCounts(secondTokenId)).to.be.bignumber.equal(
        "5"
      );
    });
    it("deploy mtp", async function() {
      expect(await this.mtp.owner()).to.equal(owner);
    });
    it("bob deposits token to mtp and alice borrows it and alice calls token function through mtp interact()", async function() {
      const token_address = await this.token.address;
      await this.token.setApprovalForAll(this.mtp.address, true, { from: bob });
      await this.mtp.deposit(token_address, firstTokenId, { from: bob });
      const uuid = await this.mtp.uuids(0);
      let Token = await this.mtp.tokens(uuid);
      expect(Token._depositor).to.equal(bob);
      expect(Token._latest_holder).to.equal(bob);
      expect(Token._token_id).to.be.bignumber.equal(firstTokenId);
      expect(Token._token_address).to.equal(token_address);
      expect(Token._hold).to.equal(true);
      expect(Token._withdraw).to.equal(false);
      await expectRevert(
        this.mtp.borrow(uuid, { from: bob }),
        "Caller must not be current holder"
      );
      await this.mtp.borrow(uuid, { from: alice });
      Token = await this.mtp.tokens(uuid);
      expect(Token._depositor).to.equal(bob);
      expect(Token._latest_holder).to.equal(alice);
      expect(Token._token_id).to.be.bignumber.equal(firstTokenId);
      expect(Token._token_address).to.equal(token_address);
      await this.mtp.withdraw(uuid, { from: bob });
      expect(await this.token.ownerOf(firstTokenId)).to.equal(bob);
      Token = await this.mtp.tokens(uuid);
      expect(Token._withdraw).to.equal(true);

      await this.token.safeTransferFrom(bob, alice, firstTokenId, {
        from: bob
      });
      await this.token.setApprovalForAll(this.mtp.address, true, {
        from: alice
      });
      await this.mtp.deposit(token_address, firstTokenId, { from: alice });
      Token = await this.mtp.tokens(uuid);
      expect(Token._depositor).to.equal(alice);
      expect(Token._latest_holder).to.equal(alice);
      expect(Token._token_id).to.be.bignumber.equal(firstTokenId);
      expect(Token._token_address).to.equal(token_address);
      expect(Token._hold).to.equal(true);
      expect(Token._withdraw).to.equal(false);

      expect(await this.token.getCounts(firstTokenId)).to.be.bignumber.equal(
        "1"
      );
      await this.mtp.interact(
        Token._mtp_uuid,
        await this.token.address,
        "increment(uint256)",
        [Token._token_id],
        {
          from: alice
        }
      );

      await expectRevert(
        this.mtp.interact(
          Token._mtp_uuid,
          await this.token.address,
          "increment(uint256)",
          [Token._token_id],
          { from: bob }
        ),
        "Caller must be current holder"
      );

      expect(await this.token.getCounts(firstTokenId)).to.be.bignumber.equal(
        "2"
      );
      await this.mtp.interact(
        Token._mtp_uuid,
        await this.token.address,
        "decrement(uint256)",
        [Token._token_id],
        {
          from: alice
        }
      );
      expect(await this.token.getCounts(firstTokenId)).to.be.bignumber.equal(
        "1"
      );
      await this.mtp.interact(
        Token._mtp_uuid,
        await this.token.address,
        "addByNumber(uint256,uint256)",
        [Token._token_id, 5],
        {
          from: alice
        }
      );
      expect(await this.token.getCounts(firstTokenId)).to.be.bignumber.equal(
        "6"
      );
    });
  });
});
