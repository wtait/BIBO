pragma solidity ^0.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";


contract TestNFT is ERC721 {
    constructor () ERC721("Test NFT", "NFTY") public {}

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId
        // string  _tokenURI
    ) public
    {
        super._mint(_to, _tokenId);
        // super._setTokenURI(_tokenId, _tokenURI);
    }
}