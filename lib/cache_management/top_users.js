"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/lib/cache_management/base')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , AddressDetailsModelKlass  = require(rootPrefix + '/app/models/address_detail')
  , AddressIdMapCacheKlass = require(rootPrefix + '/lib/cache_multi_management/addressIdMap')
  , AddressesCacheKlass = require(rootPrefix + '/lib/cache_multi_management/addresses')
;

/**
 * @constructor
 * @augments TopUsersCacheKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *                 chain_id - Chain id
 *                 contract_address - contract address of branded token
 *
 */
const TopUsersCacheKlass = function(params) {

  const oThis = this;

  oThis.chainId = params.chain_id;
  oThis.contractAddress = params.contract_address;

  baseCache.call(this, params);

  oThis.useObject = true;

};

TopUsersCacheKlass.prototype = Object.create(baseCache.prototype);

const TopUsersCacheKlassPrototype = {

  /**
   * set cache key
   *
   * @return {String}
   */
  setCacheKey: function () {

    const oThis = this;

    oThis.cacheKey = oThis._cacheKeyPrefix() + "cm_tu_"+oThis.contractAddress;

    return oThis.cacheKey;

  },

  /**
   * set cache expiry in oThis.cacheExpiry and return it
   *
   * @return {Number}
   */
  setCacheExpiry: function () {

    const oThis = this;

    oThis.cacheExpiry = 300; // 24 hours ;

    return oThis.cacheExpiry;

  },

  /**
   * fetch data from source
   *
   * @return {Result}
   */
  fetchDataFromSource: async function() {

    const oThis = this
      , addressDetailsObject = new AddressDetailsModelKlass(oThis.chainId)
      , addressIdDetails = await  new AddressIdMapCacheKlass({chain_id:oThis.chainId, addresses:[oThis.contractAddress]}).fetch()
      , addressIdData = addressIdDetails.data
    ;

    if (addressIdDetails.isFailure() || !addressIdData[oThis.contractAddress]){
      return responseHelper.error('cm_tu_1', 'Data not available for : ');
    }

    const addressId = addressIdData[oThis.contractAddress].id
    ;

    const topUsers = await addressDetailsObject.select('*')
      .where(['contract_address_id = ?', addressId])
      .order_by('tokens desc')
      .limit(15)
      .fire();

    if (topUsers.length === 0){
      return responseHelper.error('cm_tu_2', 'Data not available for');
    }

    const addressIds = [];
    for (var i=0; i<topUsers.length; i++){
      const userId = topUsers[i].address_id
      ;

      addressIds.push(userId)
    }

    const addressesDetails = await new AddressesCacheKlass({chain_id:oThis.chainId, ids:addressIds}).fetch()
      , addressesDetailsData = addressesDetails.data
    ;
    
    const formattedTopUsersData = oThis.getFormattedTopUsersData(topUsers, addressesDetailsData);

    return Promise.resolve(responseHelper.successWithData(formattedTopUsersData));
  }
  
  , getFormattedTopUsersData : function (topUsers, addresses) {

    const formattedData = []
    ;


    for (var i=0; i<topUsers.length; i++){
     const user = topUsers[i]
       , userId = user.address_id
       , address = addresses[userId].address_hash
     ;
      user['address_hash'] = address;
      formattedData.push(user)
    }

    console.log("formattedData :",formattedData);
    return formattedData;
  }
}

Object.assign(TopUsersCacheKlass.prototype, TopUsersCacheKlassPrototype);

module.exports = TopUsersCacheKlass;