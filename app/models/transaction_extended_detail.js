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
const TransactionExtendedDetailKlass = function (chainId) {
  const oThis = this
  ;

  oThis.chainId = chainId;
  ModelBaseKlass.call(oThis, {chainId: chainId});
};

TransactionExtendedDetailKlass.prototype = Object.create(ModelBaseKlass.prototype);

/*
 * Public methods
 */
const TransactionExtendedDetailPrototype = {

  tableName: coreConstants.TRANSACTION_EXTENDED_DETAILS_TABLE_NAME

};

Object.assign(TransactionExtendedDetailKlass.prototype, TransactionExtendedDetailPrototype);

TransactionExtendedDetailKlass.DATA_SEQUENCE_ARRAY = ['transaction_hash_id', 'input_data', 'logs', 'logs_bloom', 'r', 's', 'v'];

module.exports = TransactionExtendedDetailKlass;


// ttk = require('./app/models/address_details')
// new ttk().select('*').where('id>1').limit('10').fire().then(console.log);
