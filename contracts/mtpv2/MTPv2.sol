pragma solidity ^0.5.12; 

import '@openzeppelin/upgrades/contracts/Initializable.sol';
//import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";

contract MTPv2 is Initializable{

  address private _owner;

  struct Token{
    address _token_address;
    uint _token_id;
    address _from_address;
    bool _isCheckout;
  }

  struct Staker{
    address _staker_address;
    int _balance;
  }

  mapping(address => bool) public supported_tokens;
  mapping(address => bool) public isStaker;
  mapping(address => Staker) public stakers;
  mapping(uint => Token) public tokens;
  uint public total_tokens;

  modifier onlyOwner{
    require(
      msg.sender == _owner,
      "Only owner can call"
    );
    _;
  }
  modifier isSupportedToken(address _token_address){
    require(
      supported_tokens[_token_address],
      "Token not supported"
    );
    _;
  }

  function initialize() public initializer{
   _owner = msg.sender;
  }

  function getOwner() public view returns (address){
    return _owner;
  }

  function updateTokenAddress(address _address, bool _valid) public onlyOwner{
    if (_address != address(0)){
      supported_tokens[_address] = _valid;
    }
  }

  function deposit(address _token_address, uint _token_id) public {
    Staker storage staker = stakers[msg.sender];
    if(!isStaker[msg.sender]){
      isStaker[msg.sender] = true;
    }
    Token memory token;
    token._token_address = _token_address;
    token._token_id = _token_id;
    token._from_address = msg.sender;
    //staker._stakes[staker._stake_count] = token;
    staker._balance += 1;
    tokens[total_tokens] = token;
    total_tokens += 1;
  }

}
