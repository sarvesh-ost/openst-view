"use strict";
/**
 * Create instance of geth RPC provider
 *
 * @module lib/web3/providers/rpc_provider
 */
const OSTBase = require('@openstfoundation/openst-base');

/**
 * Create instance of geth RPC provider
 *
 * @constructor
 */
const web3UtilityRpcProvider = function () {
};

web3UtilityRpcProvider.prototype = {

  /**
   * Get RPC provider instance
   *
   * @param {String} rpcProvider - RPC Provider
   * @returns {Object} - Web3 object
   *
   * @methodOf web3UtilityRpcProvider
   *
   */
  getRPCproviderInstance: function (rpcProvider) {
    if (undefined == rpcProvider) {
      throw "RPC is undefined";
    }
    return new OSTBase.OstWeb3(rpcProvider);
  }

};

module.exports = new web3UtilityRpcProvider();
