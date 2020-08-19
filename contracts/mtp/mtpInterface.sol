// pragma solidity ^0.6; 


// contract mtpInterface {


//     // function depositToken(address contractAddress, address tokenOwner, uint256 tokenId) public;

//     // // withdrawToken(address contractAddress, address tokenOwner, uint256 tokenId) public;

//     // // burnStakes(uint256 tokenId) private;

//     // function addStaker(address stakerAddress_) public;

//     // addStakerToQeue
//         //
//     // removeStaker
//     // getStakeChainLength

//     function newProxy(address stakerAddress_) public returns (address);


//     // function getStakeChainLength(uint256 tokenId) public returns (uint);


//     function mtpTransfer(address tokenContract_, address to_, uint256 tokenId_) public;


//     //function pauseTransfer(address tokenContract_, uint256 tokenId, address tokenHolder)  public;

//     // Internal functions
//     //internal - only this  and contracts deriving from it can access

//     //function _isMTPItem(uint256 tokenId) internal view returns (bool);

//     // Private functions
//     //private - can be accessed only from this contract

//     //function updateBiboBalances(uint256 tokenId) private;

//     function getBalance(address account) public returns(int);

// }