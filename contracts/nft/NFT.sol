pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";


contract NFT is Initializable, ERC721Full, ERC721Mintable {
  using SafeMath for uint256;
  mapping(uint256 => uint256) private _counts;

  function initialize(string memory name, string memory symbol)
    public
    initializer
  {
    ERC721.initialize();
    ERC721Enumerable.initialize();
    ERC721Metadata.initialize(name, symbol);
    ERC721Mintable.initialize(msg.sender);
  }

  function increment(uint256 tokenId) public {
    require(ERC721.ownerOf(tokenId) == msg.sender, "must be token owner");
    _counts[tokenId] = SafeMath.add(_counts[tokenId], 1);
  }

  function decrement(uint256 tokenId) public {
    require(ERC721.ownerOf(tokenId) == msg.sender, "Must be token owner");
    _counts[tokenId] = SafeMath.sub(_counts[tokenId], 1);
  }

  function addByNumber(uint256 tokenId, uint256 num) public {
    require(ERC721.ownerOf(tokenId) == msg.sender, "must be token owner");
    _counts[tokenId] = SafeMath.add(_counts[tokenId], num);
  }

  function getCounts(uint256 tokenId) public view returns (uint256) {
    return _counts[tokenId];
  }
}
