//pragma solidity ^0.5.12;
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./AuthereumProxy.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";


/**
 * @title AuthereumProxyFactory
 * @author Authereum, Inc.
 * @dev A factory that creates Authereum Proxies.
 */

contract AuthereumProxyFactory is Initializable, Ownable {
  string public constant authereumProxyFactoryVersion = "2019111500";
  bytes private initCode;
  AuthereumProxy[] public proxies;

  event InitCodeChanged(bytes initCode);
  event createNewProxy(AuthereumProxy newProxy);

  /// @dev Constructor
  /// @param _implementation Address of the Authereum implementation
  function initialize(address _implementation) public initializer {
    Ownable.initialize(msg.sender);
    initCode = abi.encodePacked(
      type(AuthereumProxy).creationCode,
      uint256(_implementation)
    );
    emit InitCodeChanged(initCode);
  }

  /**
   * Setters
   */

  /// @dev Setter for the proxy initCode
  /// @param _initCode Init code off the AuthereumProxy and constructor
  function setInitCode(bytes memory _initCode) public onlyOwner {
    initCode = _initCode;
    emit InitCodeChanged(initCode);
  }

  /**
   *  Getters
   */

  /// @dev Getter for the proxy initCode
  /// @return Init code
  function getInitCode() public view returns (bytes memory) {
    return initCode;
  }

  /// @dev Create an Authereum Proxy and iterate through initialize data
  /// @notice The bytes[] _initData is an array of initialize functions.
  /// @notice This is used when a user creates an account e.g. on V5, but V1,2,3,
  /// @notice etc. have state vars that need to be included.
  /// @param _salt A uint256 value to add randomness to the account creation
  function createProxy(
    uint256 _salt //string memory _label,
  ) public //bytes[] memory _initData
  {
    address payable addr;
    bytes memory _initCode = initCode;
    bytes32 salt = _getSalt(_salt, msg.sender);

    // Create proxy
    assembly {
      addr := create2(0, add(_initCode, 0x20), mload(_initCode), salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }

    // Loop through initializations of each version of the logic contract
    //bool success;
    //for (uint256 i = 0; i < _initData.length; i++) {
    //require(_initData[i].length != 0, "APF: Empty initialization data");
    //(success,) = addr.call(_initData[i]);
    //require(success, "APF: Unsuccessful account initialization");
    //}

    AuthereumProxy newProxy = new AuthereumProxy();
    newProxy.initialize(addr);
    //newProxy.setOwner(msg.sender)
    proxies.push(newProxy);
    emit createNewProxy(newProxy);
  }

  function getAllProxies() public view returns (AuthereumProxy[] memory) {
    return proxies;
  }

  /// @dev Generate a salt out of a uint256 value and the sender
  /// @param _salt A uint256 value to add randomness to the account creation
  /// @param _sender Sender of the transaction
  function _getSalt(uint256 _salt, address _sender)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(_salt, _sender));
  }
}
