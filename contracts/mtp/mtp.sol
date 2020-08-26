pragma solidity ^0.6; 

import "./mtpLib.sol";
import "./mtpInterface.sol";
//import '@openzeppelin/contracts/ownership/Ownable.sol';
//import '../../node_modules/zos-lib/contracts/Initializable.sol';
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "../accounts/ProxyFactoryInterface.sol";
//import oz proxy factory
//import "../../node_modules/zos-lib/contracts/upgradeability/ProxyFactory.sol";
import "../accounts/Clone2Factory.sol";


contract mtp {



//******************
    using mtpLib for mtpLib.BiboStorage;

    using Clone2Factory for address;

    mtpLib.BiboStorage balancesStorage;
    IERC721 public ERC721Interface;

    //change to address => address[]?
    mapping(address => address) public userWallets;

    // The address of the public BIBO wallet template, used when `createWallet` is called
    address public publicBiboWalletAddress;
//********************

//   // Use initialize instead of a constructor to support proxies (for upgradeability via zos).
//   function initialize(
//         address _biboOwner
//     )
//         public
//         initializer()
//     {
//         // We must manually initialize Ownable.sol
//         Ownable.initialize(_biboOwner);
//   }

//*********

//create a contract wallet by cloning the deployed template contract and deploying at the calculated address
    function createWallet(bytes12 _salt, address _externalAccount ) public {
        require(publicBiboWalletAddress != address(0), 'MISSING_BiboWallet_TEMPLATE_ADDRESS');

        // create wallet
        bytes32 salt;
        // solium-disable-next-line
        assembly
        {
            let pointer := mload(0x40)
            // The salt is the msg.sender
            mstore(pointer, shl(96, caller()))
            // followed by the _salt provided
            mstore(add(pointer, 0x14), _salt)
            salt := mload(pointer)
        }
        address payable newBiboWallet = address(uint160(publicBiboWalletAddress.createClone2(salt)));

        userWallets[_externalAccount] = newBiboWallet;
    }

    //find the bibowallet associated with the external account
    function getUserWalletAddress(address _externalAccount) public returns (address) {
        address biboWalletAddress = userWallets[_externalAccount];
        return biboWalletAddress;
    }

    //transfer from EOA to biboWallet
    function depositToken(address tokenContract_, address depositor_, address biboWallet_, uint256 tokenId_) public {
        ERC721Interface = IERC721(tokenContract_);
        ERC721Interface.safeTransferFrom(depositor_, biboWallet_, tokenId_);
        mtpLib.setStaker(balancesStorage, tokenContract_, tokenId_, biboWallet_);
    }

    //transfer a token between bibowallets and update bibo balances
    function mtpTransfer(address tokenContract_, address from_, address to_, uint256 tokenId_) public {

        ERC721Interface = IERC721(tokenContract_);
        ERC721Interface.transferFrom(from_, to_, tokenId_);
        mtpLib.setStaker(balancesStorage, tokenContract_, tokenId_, to_);
        mtpLib.updateBalances(balancesStorage, tokenContract_, tokenId_, from_, to_);

    }

    function mtpQeueStaker(address tokenContract_, address from_, address to_, uint256 tokenId_) public {
        //need to implement a flageForPause such that, if desired, the qeued receiver can set the token to pause when it does transfer to them.
        
        ERC721Interface = IERC721(tokenContract_);
        mtpLib.setStaker(balancesStorage, tokenContract_, tokenId_, to_);
        mtpLib.updateBalances(balancesStorage, tokenContract_, tokenId_, from_, to_);

    }

    //retrieve the bibo balance of a bibowallet
    function getBalance(address _account) public returns (int) {
        int balance = mtpLib.getBalance(balancesStorage, _account);
        return balance;
    }


    //assign the address of the bibowallet template contract once it has been deployed
    // need to modify with onlyOwner
    function setPublicBiboWalletAddress(address payable _publicWalletAddress) public {
        publicBiboWalletAddress = _publicWalletAddress;
    }

    function getTokenStakers(address tokenContract_, uint256 tokenId_) public view returns (address[] memory) {
        return mtpLib.getStakers(balancesStorage, tokenContract_, tokenId_);
    }

//***********


}