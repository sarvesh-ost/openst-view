"use strict";

const rootPrefix = '../..'
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , ModelBaseKlass = require(rootPrefix + '/app/models/base')
  , addressConst = require(rootPrefix + '/lib/global_constant/address')
  , util = require(rootPrefix + '/lib/util')
;

const addressTypes = {
    '1': addressConst.userAddress,
    '2': addressConst.contractAddress,
    '3': addressConst.erc20Address
  }
  , invertedAddressTypes = util.invert(addressTypes);

/**
 * constructor
 *
 * @param {Object} chainId - chain id
 *
 * @constructor
 */
const AddressKlass = function (chainId) {
  const oThis = this
  ;

  oThis.chainId = chainId;
  ModelBaseKlass.call(oThis, {chainId: chainId});
};

AddressKlass.prototype = Object.create(ModelBaseKlass.prototype);

/*
 * Public methods
 */
const AddressSpecificPrototype = {

  tableName: coreConstants.ADDRESSES_TABLE_NAME,

  addressTypes: addressTypes,

  invertedAddressTypes: invertedAddressTypes,

  enums: {
    'address_type': {
      val: addressTypes,
      inverted: invertedAddressTypes
    }
  }
};

Object.assign(AddressKlass.prototype, AddressSpecificPrototype);

AddressKlass.DATA_SEQUENCE_ARRAY = ['address_hash', 'address_type'];

module.exports = AddressKlass;


// add = require('./app/models/address')
// new add().select('*').where('id>1').limit('10').fire().then(console.log);
