pragma solidity ^0.6; 



// contract mtpStorage {
// // State variables
//     //mapping(uint256 => Token) public tokens;//maps token id to token struct
//     mapping(address => uint256[]) public tokens; //maps token minting contracts  (i.e. crypto kitties, decentraland, etc.) to individual tokens that have been deposited for mtp sharing
//     mapping(address => address[]) public proxies; // maps externaly owned addresses to their mtp generated proxies
//     mapping(address => int256) public balances; //bibo balances. can be positive or negative;
//     mapping(uint256 => address[]) public stakers;  //maps a token id to an array of staker addresses
//     mapping(uint256 => address[]) public stakeQueu; //pending transfer callers of token when paused


//     function getTokens(address tokenContractAddress) public view returns (uint256[] memory) {
//         return tokens[tokenContractAddress];
//     }

//     function getToken(address tokenContractAddress, uint256 tokenId) public view returns (int256) {
//         return tokens[tokenContractAddress][tokenId];
//     }

//     function setToken(address tokenContractAddress, uint256 tokenId) public {
//         tokens[tokenContractAddress].push(tokenId);
//     }

//     // function removeToken(address tokenContractAddres, uint256 tokenId) {

//     // }

//     function getProxies(address stakerAddress) public view returns (address[] memory) {
//         return proxies[stakerAddress];
//     }

//     function setProxy(address stakerAddress, address proxyAddress) public {
//         proxies[stakerAddress].push(proxyAddress);
//     }

//     function getBalance(address stakerAddress) public view returns (int256 _balance) {
//         return balances[stakerAddress];
//     }

//     function setBalance(address stakerAddress, int256 newBibos) public {
//         balances[stakerAddress] += newBibos;
//     }

//     function getStakers(uint256 tokenId) public view returns (address[] memory) {
//         return stakers[tokenId];
//     }

//     function getStaker(uint256 tokenId, address stakerAddress) public view returns (int256) {
//         return stakers[tokenId][stakerAddress];
//     }

//     function setStaker(uint256 tokenId, address newStaker) public {
//         stakers[tokenId].push(newStaker);
//     }

//     // function removeStaker(uint256 tokenId, address stakerAddress) {

//     // }

//     function getStakeQueu(uint256 tokenId) public view returns (address[] memory) {
//         return stakeQueu[tokenId];
//     }

//     function setStakeQueu(uint256 tokenId, address newQeueStaker) public {
//         stakeQueu[tokenId].push(newQeueStaker);
//     }

//     // function removeStakerFromQueu(uint256 tokenId, address oldQeueStaker) {

//     // }

// }