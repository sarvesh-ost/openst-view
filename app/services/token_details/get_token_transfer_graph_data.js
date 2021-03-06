"use strict";

const rootPrefix = "../../.."
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , AddressesIdMapCacheKlass = require(rootPrefix + '/lib/cache_multi_management/addressIdMap')
  , TokenTransferGraphCacheKlass = require(rootPrefix + '/lib/cache_management/token_transfer_graph_data')
  , CronDetailsModelKlass = require(rootPrefix + '/app/models/cron_detail')
  , cronDetailConst = require(rootPrefix + '/lib/global_constant/cron_details')
  , constants = require(rootPrefix + '/config/core_constants')
;

/**
 * Get details of token transfer graph for  branded token
 *
 * @param {object} params - this is object with keys.
 *                 chainId - Chain Id.
 *                 contractAddress - contract address of branded token
 *
 * @Constructor
 */
const GetTokenTransferGraphKlass = function(params){
  const oThis = this;

  oThis.chainId = params.chainId;
  oThis.contractAddress = params.contractAddress.toLowerCase();
  oThis.duration = params.duration;
};


GetTokenTransferGraphKlass.prototype = {

  /**
   * Perform operation of getting recent token transfers details
   *
   * @return {Promise<void>}
   */
  perform: async function () {
    const oThis = this;

    let contractAddressId = 0;

    try {
      //Check for common data
      if (Number(oThis.contractAddress) !== 0) {
        const response = await new AddressesIdMapCacheKlass({
          chain_id: oThis.chainId,
          addresses: [oThis.contractAddress]
        }).fetch()
          , responseData = response.data;
        if (response.isFailure() || !responseData[oThis.contractAddress]) {
          return Promise.resolve(responseHelper.error("a_s_ttgd_3", "GetTokenTransferGraphKlass :: AddressesIdMapCacheKlass :: response Failure Or contract Address not found ::" + oThis.contractAddress));
        }
        contractAddressId = responseData[oThis.contractAddress].id;
      } else {
        contractAddressId = 0;
      }

      const latestTimestamp = Date.now()/1000;

      const tokenTransferGraphResponse = await new TokenTransferGraphCacheKlass({
        chain_id: oThis.chainId,
        contract_address_id: contractAddressId,
        duration: oThis.duration,
        latestTimestamp: latestTimestamp
      }).fetch();

      if (tokenTransferGraphResponse.isFailure()) {
        return Promise.resolve(responseHelper.error("a_s_ttgd_1", "Fail to fetch graph data for token transfers"));
      }
      return Promise.resolve(responseHelper.successWithData(tokenTransferGraphResponse.data));
    } catch (err) {
      return Promise.resolve(responseHelper.error("a_s_ttgd_2", "Fail to fetch graph data for token transfers "+ err));
    }
  }
};

module.exports = GetTokenTransferGraphKlass;

/*
  TokenServiceKlass = require('./app/services/token_details/get_token_transfer_graph_data.js');
  new TokenServiceKlass({chainId:1409, contractAddress: '0xae2ac19e2c8445e9e5c87e5412cf8ed419f1a5c6', duration:'hour'}).perform().then(console.log);
 */