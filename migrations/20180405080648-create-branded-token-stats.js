'use strict';

var dbm;
var type;
var seed;

const rootPrefix = '..'
  , constants = require(rootPrefix + '/config/core_constants.js')
;
/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return createBrandedTokenStatsTable(db)
    .then(function () {
      return createIndexOnBrandedTokenStatsTable(db)
    });
};

exports.down = function(db) {
  return deleteBrandedTokenStatsTable(db);
};

const createBrandedTokenStatsTable = function (db) {
  return db.createTable(constants.BRANDED_TOKENS_STATS_TABLE_NAME, {
    id: {type: 'bigint', notNull: true, primaryKey: true, autoIncrement: true},
    contract_address_id: {type: 'bigint', notNull: true},
    token_holders: {type: 'int', notNull: true, default: 0},
    token_transfers: {type: 'int', notNull: true, default: 0},
    total_supply: {type:'decimal', length:'40,0',notNull: false},
    token_ost_volume: {type:'decimal', length:'40,0',notNull: false},
    market_cap: {type:'decimal', length:'40,0',notNull: false},
    circulation: {type:'decimal', length:'40,0',notNull: false},
    created_at:{type: 'datetime', notNull: true},
    updated_at:{type: 'datetime', notNull: true}
  });
};

const createIndexOnBrandedTokenStatsTable = function (db) {
  db.addIndex(constants.BRANDED_TOKENS_STATS_TABLE_NAME, 'btts_cai_index', 'contract_address_id', true);
};

const deleteBrandedTokenStatsTable = function (db) {
  return db.dropTable(constants.BRANDED_TOKENS_STATS_TABLE_NAME);
};

