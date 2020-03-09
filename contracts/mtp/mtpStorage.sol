pragma solidity ^0.5.12; 



contract mtpStorage {
// State variables
    //mapping(uint256 => Token) public tokens;//maps token id to token struct
    //mapping(address => Staker) public stakers;
    mapping(address => uint256[]) public tokens; //maps token minting contracts  (i.e. crypto kitties, decentraland, etc.) to individual tokens that have been deposited for mtp sharing
    mapping(address => address[]) public proxies; // maps externaly owned addresses to their mtp generated proxies
    mapping(address => int256) public balances; //bibo balances. can be positive or negative;
    mapping(uint256 => address[]) public stakers;  //maps a token id to an array of staker addresses
    mapping(uint256 => address[]) public stakeQueu; //pending transfer callers of token when paused


    function getTokens(address tokenContractAddress) returns (uint256[]) {
        return tokens[tokenContractAddress]
    }

    function setToken(address tokenContractAddress, uint256 tokenId) {
        tokens[tokenContractAddress].push(tokenId)
    }

    // function removeToken(address tokenContractAddres, uint256 tokenId) {

    // }

    function getProxies(address stakerAddress) returns (address[] proxies) {
        return proxies[stakerAddress]
    }

    function setProxy(address stakerAddress, address proxyAddress) returns {
        proxies[stakerAddress].push(proxyAddress)
    }

    function getBalance(address stakerAddress) returns (int256 _balance) {
        return balances[stakerAddress]
    }

    function setBalance(address stakerAddress, int256 newBibos) {
        balances[stakerAddress] += newBibos
    }

    function getStakers(uint256 tokenId) returns (address[] stakers) {
        return stakers[tokenId]
    }

    function setStaker(uint256 tokenId, address newStaker) {
        stakeChain[tokenId].push(newStaker)
    }

    // function removeStaker(uint256 tokenId, address stakerAddress) {

    // }

    function getStakeQueu(uint256 tokenId) returns (address[] stakeQueu) {
        return stakeQueu[tokenId]
    }

    function setStakeQueu(uint256 tokenId, address newQeueStaker) {
        stakeQueu[tokenId].push(newQeueStaker)
    }

    // function removeStakerFromQueu(uint256 tokenId, address oldQeueStaker) {

    // }

}