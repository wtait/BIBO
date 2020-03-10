// Pragma statements
pragma solidity ^0.5.12; 


// Import statements
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "/mtpStorage.sol";



// Interfaces
    //IERC721 public ERC721Interface;
    //IMTP public MTPInterface
// Libraries

// Contracts

library MTP {

    //constructor
    // constructor() public {
    //     // ...
    // }

    //IERC721 public ERC721Interface;

// Type declarations
// State variables


    struct Staker { //change to TokenStaker
        address staker_Address_; //redundant
        int staker_Stake_Balance_; //must support negative integers
    }

    struct Token {
        address token_Address_; //this is redundant
        uint256 token_id_; //for nft tokens
        uint token_Stake_Balance_;
        bool is_paused_;
    }

// Events
    //StakerAdded
        event StakerAdded(
            address indexed stakerAddress
        );
    //TokenAdded
        event TokenAdded(
            address indexed tokenContractAddress,
            address indexed tokenOwner,
            uint256 indexed tokenID
        );
    //newMTPTransfer
        event NewMTPTransfer(
            address indexed tokenContractAddress,
            uint256 indexed tokenID,
            address indexed tokenReceiver,
            address tokenSender
        );
    //TokenTranferPaused
        event TokenTransferPaused(
            uint256 indexed tokenId,
            address indexed tokenHolder
        );
    //TokenTransferUnpaused
        event TokenTransferUnpaused(
            uint256 indexed tokenId,
            address indexed tokenHolder
        );
    //TokenWithdrawn
        event TokenWithdrawal(
            address indexed tokenContractAddress,
            address indexed tokenOwner,
            uint256 indexed tokenId
        );
    //StakerRemoved
        event StakerRemoved(
            address indexed StakerAddress,
            uint indexed numberOfStakers
        );
    //tokenPaused
        event TokenPaused(
            address indexed tokenContractAddress,
            address indexed tokenOwner,
            uint256 indexed tokenId
        );
    //BurnStakes
    //newMTPNetworkDeployed
    //newProxyFactoryDeployed
    //ProxyCreated



// Functions

    // External functions
    // external - Cannot be accessed internally, only externally

    // External functions that are view
    // ...

    // External functions that are pure
    // ...

    // Public functions
    //public - all can accesscontract
        // depositToken
    function depositToken(address contractAddress, address tokenOwner, uint256 tokenId) public {
        if(!mtpStorage.getToken(contractAddress, tokenId)) {
            mtpStorage.setToken(tokenContractAddress, tokenId)
        }

        emit TokenAdded(contractAddress, tokenOwner, tokenId);
    }

    // withdrawToken(address contractAddress, address tokenOwner, uint256 tokenId) public {
        //tokenOwner bibo balance >0 ?
        //is tokenOwner root owner?
        //burn token stakes
        //remove token from mapping
        //withdraw from proxy account
    //}

    // burnStakes(uint256 tokenId) private {
        //
        // address[] memory tokenStakeChain = stakeChain[tokenId];

        // for(uint i = 0; i < tokenStakeChain.length; i++) {
        //     address currentStakerAddress = tokenStakeChain[i];
        //     uint stakersBefore = i;
        //     uint stakersAfter = tokenStakeChain.length - (i + 1);
        //     int  stakerNewStakes = int256(stakersAfter) - int256(stakersBefore);
        //     balances[currentStakerAddress] -= stakerNewStakes;
        // }
    // }

        // addStakerToQeue
            //
        // removeStaker
        // getStakeChainLength
    function getStakeChainLength(uint256 tokenId) public returns (uint) {
        return mtpStorage.getStakers[tokenId].length;
    }

        // mtpTransfer
    function mtpTransfer(address tokenContract_, address to_, uint256 tokenId_) public {
        onlyMTPItem(tokenContract_, tokenId_);

        address from_ = msg.sender;

        if(!mtpStorage.getStaker(tokenId_, from_)) {
            mtpStorage.setStaker(tokenId_, from_);
            emit StakerAdded(from_);
        }

        mtpStorage.setStaker(tokenId_, to_);
        emit StakerAdded(to_);

        updateBiboBalances(tokenId_);

        ERC721Interface = IERC721(tokenContract_);
        ERC721Interface.safeTransferFrom(from_, to_, tokenId_);
        emit NewMTPTransfer(tokenContract_, tokenId_, to_, from_);
    }


    // function pauseTransfer(address tokenContract_, uint256 tokenId, address tokenHolder)  public {

    //     if(balances[tokenHolder] >= 0) {
    //         Token storage t = tokens[tokenId];
    //         t.is_paused_ = true;
    //     }

    //     emit TokenPaused(tokenContract_, tokenHolder, tokenId);
    // }

    // Internal functions
    //internal - only this  and contracts deriving from it can access
        // isMTPToken
    modifier onlyMTPItem (address tokenContractAddress, uint256 tokenId) {
        require (mtpStorage.getToken(tokenContractAddress, tokenId) != 0)
        _;
    }

    // Private functions
    //private - can be accessed only from this contract
        // updateBiboBalances

    function updateBiboBalances(uint256 tokenId) private {
        address[] memory tokenStakeChain = mtpStorage.getStakers(tokenId);

        for(uint i = 0; i < tokenStakeChain.length; i++) {
            address currentStakerAddress = tokenStakeChain[i];
            uint stakersBefore = i;
            uint stakersAfter = tokenStakeChain.length - (i + 1);
            int  stakerNewStakes = int256(stakersAfter) - int256(stakersBefore);
            mtpStorage.setBalance(currentStakerAddress, newBibos);
        }
    }
}