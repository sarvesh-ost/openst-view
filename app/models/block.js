"use strict";

const rootPrefix = '../..'
  , ModelBaseKlass = require(rootPrefix + '/app/models/base')
  , blockConst = require(rootPrefix + '/lib/global_constant/block')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , util = require(rootPrefix + '/lib/util')
;

const verified = {
    '1': blockConst.unverified,
    '2': blockConst.verified
  }

  , statuses = {
    '1': blockConst.pendingStatus,
    '2': blockConst.completeStatus,
    '3': blockConst.failedStatus
  }
  , invertedStatuses = util.invert(statuses)
  , invertedVerified = util.invert(verified)
;

/**
 * constructor
 *
 * @param {Object} chainId - chain id
 *
 * @constructor
 */
const BlockKlass = function (chainId) {
  const oThis = this
  ;

  oThis.chainId = chainId;
  ModelBaseKlass.call(oThis, {chainId: chainId});
};

BlockKlass.prototype = Object.create(ModelBaseKlass.prototype);

/*
 * Public methods
 */
const BlockSpecificPrototype = {

  tableName: coreConstants.BLOCKS_TABLE_NAME,

  statuses: statuses,

  invertedStatuses: invertedStatuses,

  verified: verified,

  invertedVerified: invertedVerified,

  enums: {
    'verified': {
      val: verified,
      inverted: invertedVerified
    },
    'status': {
      val: statuses,
      inverted: invertedStatuses
    }
  },

  getLastVerifiedBlockNumber: function() {
    const oThis = this
    ;

    return new Promise(function (resolve, reject) {

      oThis.select('verified, max(block_number) as max_block_number, min(block_number) as min_block_number')
        .group_by('verified').fire().then(function (rows) {

        var unverifiedMinBlockNumber = null
          , verifiedMaxBlockNumber = null
        ;

        for (var i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row.verified === Number(oThis.invertedVerified[blockConst.unverified])) {
            unverifiedMinBlockNumber = row.min_block_number - 1;
          } else {
            verifiedMaxBlockNumber = row.max_block_number;
          }
        }

        if (unverifiedMinBlockNumber) {
          return resolve(unverifiedMinBlockNumber);
        } else {
          return resolve(verifiedMaxBlockNumber);
        }
      })
        .catch(function (err) {
          return reject("Exception in getLastVerifiedBlockblockNumber:: " + err);
        });
    });
  },

  getLastVerifiedBlockTimestamp: function () {
    const oThis = this;

    return new Promise(function(resolve, reject){
      oThis.select('verified, max(block_timestamp) as max_timestamp, min(block_timestamp) as min_timestamp').group_by('verified').fire().then(function (rows) {

        var unverifiedMinTime = null
          , verifiedMaxTime = null
        ;

        for (var i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row.verified) {
            unverifiedMinTime = row.min_timestamp -1;
          } else {
            if (verifiedMaxTime){
              verifiedMaxTime = Math.max(row.max_timestamp, verifiedMaxTime);
            }else{
              verifiedMaxTime = row.max_timestamp;
            }
          }
        }

        if (unverifiedMinTime) {
          return resolve(unverifiedMinTime);
        } else {
          return resolve(verifiedMaxTime);
        }
      })
        .catch(function(err){
          return reject("interact#getLastVerifiedBlockTimestamp error ::" + err);
        });
    });
  }

};

Object.assign(BlockKlass.prototype, BlockSpecificPrototype);

BlockKlass.DATA_SEQUENCE_ARRAY = ['block_number', 'block_hash', 'parent_hash', 'difficulty', 'total_difficulty', 'gas_limit', 'gas_used', 'total_transactions', 'block_timestamp', 'verified', 'status'];

module.exports = BlockKlass;

// ttk = require('./app/models/block')
// new ttk().select('*').where('id>1').limit('10').fire().then(console.log);
