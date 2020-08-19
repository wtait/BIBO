pragma solidity ^0.6;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
//import "@openzeppelin/contracts/tokens/erc721-token-receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BiboWallet {
    address public accountHolderAddress;
    address public mtpContractAddress;
    
    IERC721 public ERC721Interface;
    //event Received(address operator, address from, uint256 tokenId, bytes data, uint256 gas);

   //####not secure, just for testing#####
    function intitialize (address accountOwner_, address mtpContract_) public  returns (address) {
        accountHolderAddress = accountOwner_;
        mtpContractAddress = mtpContract_;
    }


    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    )
        external
        returns(bytes4)
    {
        return 0x150b7a02;
    }

    function approved(address tokenContract_, address mtpAddress) external {
        ERC721Interface = IERC721(tokenContract_);
        ERC721Interface.setApprovalForAll(mtpAddress, true);
    }



    // //###transaction forwarding copied from uport: https://github.com/uport-project/uport-identity/blob/develop/contracts/Proxy.sol

    // event Forwarded (address indexed destination, uint value, bytes data);
    // event Received (address indexed sender, uint value);

    // //fallback function
    // fallback() payable { Received(msg.sender, msg.value); }

    // function forward(address destination, uint value, bytes data) public onlyOwner {
    //     require(executeCall(destination, value, data));
    //     Forwarded(destination, value, data);
    // }

    // // copied from GnosisSafe
    // // https://github.com/gnosis/gnosis-safe-contracts/blob/master/contracts/GnosisSafe.sol
    // function executeCall(address to, uint256 value, bytes data) internal returns (bool success) {
    //     assembly {
    //         success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
    //     }
    // }

    //example delegate call: in our case we need to delegate the transferNFT function to the mtp contract 
    // function addValuesWithDelegateCall(address calculator, uint256 a, uint256 b) public returns (uint256) {
    //     (bool success, bytes memory result) = calculator.delegatecall(abi.encodeWithSignature("add(uint256,uint256)", a, b));
    //     emit AddedValuesByDelegateCall(a, b, success);
    //     return abi.decode(result, (uint256));
    // }
       
    // function mtpTransfer(address tokenContract_, address from_, address to_, uint256 tokenId_) public {
    //     //address from_ = msg.sender;

    //     ERC721Interface = IERC721(tokenContract_);
    //     ERC721Interface.safeTransferFrom(from_, to_, tokenId_);
    //     mtpLib.updateBalances(balancesStorage, from_, to_);
    // }

    // function delegatedMtpTransfer(address tokenContract_, address from_, address to_, uint256 tokenId_) public {
    //     MTP.delegatecall(abi.encodeWithSignature("mtpTransfer(address,address,address,uint256)", tokenContract_, from_, to_, tokenId));
    // }



}








//  pragma solidity ^0.6.10;

// import "./common/OnlyOwnerModule.sol";

// /**
//  * @title NftTransfer
//  * @dev Module to transfer NFTs (ERC721),
//  * @author Olivier VDB - <olivier@argent.xyz>
//  */
// contract NftTransfer is OnlyOwnerModule {

//     bytes32 constant NAME = "NftTransfer";

//     // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
//     bytes4 private constant ERC721_RECEIVED = 0x150b7a02;

//     // The address of the CryptoKitties contract
//     address public ckAddress;

//     // *************** Events *************************** //

//     event NonFungibleTransfer(address indexed wallet, address indexed nftContract, uint256 indexed tokenId, address to, bytes data);

//     // *************** Constructor ********************** //

//     constructor(
//         IModuleRegistry _registry,
//         IGuardianStorage _guardianStorage,
//         address _ckAddress
//     )
//         BaseModule(_registry, _guardianStorage, NAME)
//         public
//     {
//         ckAddress = _ckAddress;
//     }

//     // *************** External/Public Functions ********************* //

//     /**
//      * @dev Inits the module for a wallet by setting up the onERC721Received
//      * static call redirection from the wallet to the module.
//      * @param _wallet The target wallet.
//      */
//     function init(address _wallet) public override onlyWallet(_wallet) {
//         IWallet(_wallet).enableStaticCall(address(this), ERC721_RECEIVED);
//     }

//     /**
//      * @notice Handle the receipt of an NFT
//      * @dev An ERC721 smart contract calls this function on the recipient contract
//      * after a `safeTransfer`. If the recipient is a BaseWallet, the call to onERC721Received
//      * will be forwarded to the method onERC721Received of the present module.
//      * @return bytes4 `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
//      */
//     function onERC721Received(
//         address /* operator */,
//         address /* from */,
//         uint256 /* tokenId */,
//         bytes calldata /* data*/
//     )
//         external
//         returns (bytes4)
//     {
//         return ERC721_RECEIVED;
//     }

//     /**
//     * @dev lets the owner transfer NFTs from a wallet.
//     * @param _wallet The target wallet.
//     * @param _nftContract The ERC721 address.
//     * @param _to The recipient.
//     * @param _tokenId The NFT id
//     * @param _safe Whether to execute a safe transfer or not
//     * @param _data The data to pass with the transfer.
//     */
//     function transferNFT(
//         address _wallet,
//         address _nftContract,
//         address _to,
//         uint256 _tokenId,
//         bool _safe,
//         bytes calldata _data
//     )
//         external
//         onlyWalletOwner(_wallet)
//         onlyWhenUnlocked(_wallet)
//     {
//         bytes memory methodData;
//         if (_nftContract == ckAddress) {
//             methodData = abi.encodeWithSignature("transfer(address,uint256)", _to, _tokenId);
//         } else {
//            if (_safe) {
//                methodData = abi.encodeWithSignature(
//                    "safeTransferFrom(address,address,uint256,bytes)", _wallet, _to, _tokenId, _data);
//            } else {
//                require(isERC721(_nftContract, _tokenId), "NT: Non-compliant NFT contract");
//                methodData = abi.encodeWithSignature(
//                    "transferFrom(address,address,uint256)", _wallet, _to, _tokenId);
//            }
//         }
//         invokeWallet(_wallet, _nftContract, 0, methodData);
//         emit NonFungibleTransfer(_wallet, _nftContract, _tokenId, _to, _data);
//     }

//     // *************** Internal Functions ********************* //

//     /**
//     * @dev Check whether a given contract complies with ERC721.
//     * @param _nftContract The contract to check.
//     * @param _tokenId The tokenId to use for the check.
//     * @return true if the contract is an ERC721, false otherwise.
//     */
//     function isERC721(address _nftContract, uint256 _tokenId) internal returns (bool) {
//         // solium-disable-next-line security/no-low-level-calls
//         (bool success, bytes memory result) = _nftContract.call(abi.encodeWithSignature("supportsInterface(bytes4)", 0x80ac58cd));
//         if (success && result[0] != 0x0)
//             return true;

//         // solium-disable-next-line security/no-low-level-calls
//         (success, result) = _nftContract.call(abi.encodeWithSignature("supportsInterface(bytes4)", 0x6466353c));
//         if (success && result[0] != 0x0)
//             return true;

//         // solium-disable-next-line security/no-low-level-calls
//         (success,) = _nftContract.call(abi.encodeWithSignature("ownerOf(uint256)", _tokenId));
//         return success;
//     }

// }