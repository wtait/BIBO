# BIBO

BIBO standalone implementation

- [x] user can deposit token into mtp
- [x] user can borrow token in mtp
- [x] user can withdraw token from mtp
- [x] user can interact with token functions via mtp
- [x] convert interact function to support dynamic params
- [x] interact only supports uint256 params, convert it to support other types

```
npm i
npx oz compile
npm test
```

### StandaloneMTP's interact function now supports dynamic params

```
  function interact( bytes32 uuid, address contract_address, bytes memory abi_code)
```

- uuid is bytes32 retrieve from the return array of mtp getAlluuids( )
- contract_address is the ERC721 token contract address
- abi_code is the precompiled abi string of the token function and params using

   ```
   web3.eth.abi.encodeFunctionCall(jsonInterface, parameters);
   ```
sample web3 call loks like this
```
const uuids = await this.mtp.getAlluuids();
const Token = await this.mtp.tokens(uuid[0]);

await this.mtp.interact(
    Token._mtp_uuid,
    await this.token.address,
    web3.eth.abi.encodeFunctionCall(
      {
        name: "addByNumber",
        type: "function",
        inputs: [
          { type: "uint256", name: "tokenId" },
          { type: "uint256", name: "num" }
        ]
      },
      [`${Token._token_id}`, `${5}`]
    ),
    {
      from: alice
    }
);

```

