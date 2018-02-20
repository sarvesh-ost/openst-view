"use strict";

/*
 * OpenST Explorer configuration file:
 *
 * Explorer is built to work with multiple OpenST utility chains
 */

//Chain config
const chain_config = {
  '2001': {
    chainId: 2001,
    database_type: "mysql",
    web_rpc: "http://devValueChain.com:8545",
    poll_interval: 2000,
    db_config: {
      chainId: 2001,
      driver: 'mysql',
      user: 'root',
      password: 'root',
      host: 'localhost',
      database: 'ost_staging_explorer',
      connectionLimit: 10,
      blockAttributes: ['miner', 'difficulty', 'totalDifficulty', 'gasLimit', 'gasUsed'],
      txnAttributes: ['gas', 'gasPrice', 'input', 'nonce', 'contractAddress']
    }
  },

  '2000': {
    chainId: 2000,
    database_type: "mysql",
    web_rpc: "http://devUtilityChain.com:9546",
    poll_interval: 1,
    db_config: {
      chainId: 2000,
      driver: 'mysql',
      user: 'root',
      password: 'root',
      host: 'localhost',
      database: 'ost_explorer_2000',
      connectionLimit: 10,
      blockAttributes: ['miner', 'difficulty', 'totalDifficulty', 'gasLimit', 'gasUsed'],
      txnAttributes: ['gas', 'gasPrice', 'input', 'nonce', 'contractAddress']
    }
  },
  '1410': {
      chainId: 1410,
      database_type: "mysql",
      web_rpc: "http://devValueChain.com:8545",
      poll_interval: 1,
      db_config: {
        chainId: 1410,
        driver: 'mysql',
        user: 'root',
        password: 'root',
        host: 'localhost',
        database: 'ost_explorer_1410',
        connectionLimit: 10,
        blockAttributes: ['miner', 'difficulty', 'totalDifficulty', 'gasLimit', 'gasUsed'],
        txnAttributes: ['gas', 'gasPrice', 'input', 'nonce', 'contractAddress']
      }
  }
};

module.exports = {

  getChainConfig: function(chainId) {
    return chain_config[chainId];
  },

  getChainDbConfig: function(chainId) {
    if (this.getChainConfig(chainId)) {
      return this.getChainConfig(chainId).db_config;
    }
  },

  getWebRpcUrl: function(chainId) {
    if (this.getChainConfig(chainId)) {
      return this.getChainConfig(chainId).web_rpc;
    }
  },

  getAllChainIDs: function() {
    return Object.keys(chain_config);
  }
};
