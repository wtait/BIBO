pragma solidity ^0.5.12;

import '@openzeppelin/upgrades/contracts/Initializable.sol';
import '@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol';
import '@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Mintable.sol';

contract NFT is Initializable, ERC721Full, ERC721Mintable {

  mapping(uint256=>uint) private _counts;
  function initialize(string memory name, string memory symbol) public initializer {
    ERC721.initialize();
    ERC721Enumerable.initialize();
    ERC721Metadata.initialize(name,symbol);
    ERC721Mintable.initialize(msg.sender);
  }

  //function mintUniuqeToken()public{
    //ERC721Mintable.mint(msg.sender, ERC721Enumerable.totalSupply());
  //}

  function increment(uint256 tokenId)public{
    if (ERC721.ownerOf(tokenId) == msg.sender){
      _counts[tokenId] += 1;
    }
  }

  function getCounts(uint256 tokenId) public view returns(uint){
    return _counts[tokenId];
  }
}
