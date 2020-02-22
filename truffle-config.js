const HOST = process.env.RPC_HOST || "localhost";
const PORT = process.env.RPC_PORT || 7545;

module.exports = {
  networks: {
    development: {
      host: HOST,
      port: PORT,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: function() {
        return new PrivateKeyProvider(
          "2950965425A2B3ABE4164C3A39DA1D96892728B1660980794E534A811017F2E9",
          "https://rinkeby.infura.io/v3/52c3f45afcfe42c3b68ec83186092ff0"
        );
      },
      network_id: 4
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.16", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        }
        //  evmVersion: "byzantium"
      }
    }
  }
};
