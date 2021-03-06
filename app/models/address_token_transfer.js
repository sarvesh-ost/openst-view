"use strict";

const rootPrefix = '../..'
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , ModelBaseKlass = require(rootPrefix + '/app/models/base')
;

/**
 * constructor
 *
 * @param {Object} chainId - chain id
 *
 * @constructor
 */
const AddressTokenTransferKlass = function (chainId) {
  const oThis = this
  ;

  oThis.chainId = chainId;
  ModelBaseKlass.call(oThis, {chainId: chainId});
};

AddressTokenTransferKlass.prototype = Object.create(ModelBaseKlass.prototype);

/*
 * Public methods
 */
const AddressTokenTransferSpecificPrototype = {

  tableName: coreConstants.ADDRESS_TOKEN_TRANSFERS_TABLE_NAME

};

Object.assign(AddressTokenTransferKlass.prototype, AddressTokenTransferSpecificPrototype);

AddressTokenTransferKlass.DATA_SEQUENCE_ARRAY = ['address_id', 'corresponding_address_id', 'transaction_hash_id', 'contract_address_id', 'tokens', 'inflow', 'tx_timestamp'];

module.exports = AddressTokenTransferKlass;


// ttk = require('./app/models/address_details')
// new ttk().select('*').where('id>1').limit('10').fire().then(console.log);
