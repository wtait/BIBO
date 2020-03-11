pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/IERC721Full.sol";


contract StandaloneMTP is Initializable, Ownable {
  struct Token {
    bytes32 _mtp_uuid;
    address _token_address;
    uint256 _token_id;
    address _depositor;
    address _latest_holder;
    bool _hold;
    bool _withdraw;
  }
  //mapping(address => User) public users;
  mapping(bytes32 => Token) public tokens; //mtp_uuid => return token struct
  bytes32[] public uuids;

  IERC721Full public ERC721Interface;
  address private _contract;

  function initialize() public initializer {
    Ownable.initialize(msg.sender);
  }

  function deposit(address token_address, uint256 token_id) public {
    ERC721Interface = IERC721Full(token_address);
    require(
      msg.sender == ERC721Interface.ownerOf(token_id),
      "Must be token owner"
    );
    ERC721Interface.transferFrom(msg.sender, address(this), token_id);
    bytes32 uuid = keccak256(abi.encodePacked(token_address, token_id));
    if (tokens[uuid]._hold) {
      tokens[uuid]._depositor = msg.sender;
      tokens[uuid]._latest_holder = msg.sender;
      tokens[uuid]._withdraw = false;
      return;
    }
    tokens[uuid] = Token({
      _mtp_uuid: uuid,
      _token_address: token_address,
      _token_id: token_id,
      _depositor: msg.sender,
      _latest_holder: msg.sender,
      _hold: true,
      _withdraw: false
    });
    uuids.push(uuid);
  }

  function borrow(bytes32 uuid) public {
    require(!tokens[uuid]._withdraw, "Token was withdrawed");
    require(
      msg.sender != tokens[uuid]._latest_holder,
      "Caller must not be current holder"
    );
    tokens[uuid]._latest_holder = msg.sender;
  }

  function withdraw(bytes32 uuid) public {
    require(!tokens[uuid]._withdraw, "Token was withdrawed");
    require(tokens[uuid]._depositor == msg.sender, "Caller must be depositor");
    ERC721Interface = IERC721Full(tokens[uuid]._token_address);
    tokens[uuid]._withdraw = true;
    ERC721Interface.transferFrom(
      address(this),
      msg.sender,
      tokens[uuid]._token_id
    );
  }

  function interact(
    address contract_address,
    string memory function_call,
    bytes32 uuid
  ) public {
    require(!tokens[uuid]._withdraw, "Token was withdrawed");
    require(
      tokens[uuid]._latest_holder == msg.sender,
      "Caller must be current holder"
    );

    _setDC(contract_address);
    bytes4 sig = bytes4(keccak256(bytes(function_call)));
    uint256 val = tokens[uuid]._token_id;
    _contract.call(abi.encodePacked(sig, val));
    //assembly {
    //let ptr := mload(0x40)
    //mstore(ptr, sig)
    //mstore(add(ptr, 0x04), val)
    //let result := call(15000, sload(_contract_slot), 0, ptr, 0x24, ptr, 0x20)
    //if eq(result, 0) {
    //revert(0, 0)
    //}
    //mstore(0x40, add(ptr, 0x24))
    //}
  }

  function getAlluuids() public view returns (uint256) {
    return uuids.length;
  }

  // private function to set contract address for interact()
  function _setDC(address _contract_address) private {
    _contract = _contract_address;
  }
}
