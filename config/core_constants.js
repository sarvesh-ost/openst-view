"use strict";
/**
 * Core Constants file
 */

const constants = {};

function define(key, value) {
	constants[key] = value;
}

// Available table names
define('BLOCKS_TABLE_NAME', 'blocks');
define('TRANSACTIONS_TABLE_NAME', 'transactions');
define('TRANSACTION_EXTENDED_DETAILS_TABLE_NAME','transaction_extended_details');
define('TOKEN_TRANSFERS_TABLE_NAME', 'token_transfers');
define('ADDRESS_DETAILS_TABLE_NAME', 'address_details');
define('ADDRESS_TRANSACTIONS_TABLE_NAME', 'address_transactions');
define('ADDRESS_TOKEN_TRANSFERS_TABLE_NAME', 'address_token_transfers');

define('ADDRESSES_TABLE_NAME','addresses');
define('TRANSACTIONS_HASHES_TABLE_NAME','transaction_hashes');

define('BRANDED_TOKENS_TABLE_NAME', 'branded_tokens');
define('BRANDED_TOKENS_STATS_TABLE_NAME', 'branded_token_stats');
define('AGGREGATED_TABLE_NAME', 'aggregated_data');
define('TRANSACTION_TYPE_TABLE_NAME', 'transaction_type');
define('BRANDED_TOKEN_TRANSACTION_TYPES_TABLE_NAME', 'branded_token_transaction_types');
define('BLOCK_STATUS_TABLE_NAME', 'block_status');
define('AGGREGATE_STATUS_TABLE_NAME', 'aggregate_status');
define('GRAPH_DATA_TABLE_NAME', 'graph_data');

// Available columns in tables
define('BLOCKS_DATA_SEQUENCE', '(block_number, block_hash, parent_hash, difficulty, total_difficulty, gas_limit, gas_used, total_transactions, block_timestamp, verified ,status)');
define('BLOCKS_DATA_SEQUENCE_ARRAY', ['block_number', 'block_hash', 'parent_hash', 'difficulty', 'total_difficulty', 'gas_limit', 'gas_used', 'total_transactions', 'block_timestamp', 'verified' ,'status']);
define('TRANSACTION_DATA_SEQUENCE_ARRAY', ['transaction_hash_id', 'block_number', 'transaction_index', 'contract_address_id', 'from_address_id', 'to_address_id', 'tokens', 'gas_used', 'gas_price', 'nounce','block_timestamp', 'status']);
define('TRANSACTION_DATA_SEQUENCE', '(transaction_hash, block_number, transaction_index, contract_address, t_from, t_to, tokens, gas_used, gas_price, nounce, input_data, logs, timestamp, status, logs_bloom, r, s, v)');
define('ADDRESS_TRANSACTION_DATA_SEQUENCE', '(address, corresponding_address, tokens, transaction_hash, transaction_fees, inflow, timestamp)');
define('TOKEN_TRANSACTION_DATA_SEQUENCE', '(transaction_hash, contract_address, t_from, t_to, tokens, timestamp, block_number)');
define('ADDRESS_TOKEN_TRANSACTION_DATA_SEQUENCE', '(address, corresponding_address, tokens, contract_address, transaction_hash, inflow, timestamp)');
define('AGGREGATE_DATA_SEQUENCE', '(total_transactions, total_transaction_value, total_transfers, total_transfer_value, transaction_type_id, branded_token_id, time_id, token_ost_volume)');
define('ADDRESS_DATA_SEQUENCE', '(address.address, address.branded_token_id, address.tokens,address.tokens_earned, address.tokens_spent, address.total_transactions)');
define('BRANDED_TOKEN_DATA_SEQUENCE', '(branded_token.id, branded_token.company_name, branded_token.contract_address, branded_token.company_symbol, ' +
'branded_token.uuid, branded_token.price, branded_token.token_holders, branded_token.market_cap, branded_token.circulation, branded_token.total_supply, ' +
'branded_token.transactions_data, branded_token.transactions_volume_data, branded_token.tokens_transfer_data, branded_token.tokens_volume_data, ' +
'branded_token.transaction_type_data, branded_token.token_transfers, branded_token.token_ost_volume, branded_token.creation_time, branded_token.symbol_icon)');

// Index Map
define('TRANSACTION_INDEX_MAP', {'transaction_hash':0, 'block_number':1, 'transaction_index':2, 'contract_address':3, 't_from':4, 't_to':5, 'tokens':6, 'gas_used':7, 'gas_price':8, 'nounce':9, 'input_data': 10, 'logs':11, 'timestamp':12});
define('TOKEN_TRANSACTION_INDEX_MAP', {'transaction_hash':0, 'contract_address':1, 't_from':2, 't_to':3, 'tokens':4, 'timestamp':5, 'block_number': 6});

//constants
define('ACCOUNT_HASH_LENGTH',42);
define('TRANSACTION_HASH_LENGTH', 66);
define('DEFAULT_PAGE_SIZE', 10);
define('DEFAULT_PAGE_NUMBER',1);
define('AGGREGATE_CONSTANT', 5 * 60);
define('TOP_TOKENS_LIMIT_COUNT',500);
define('FETCHER_BATCH_SIZE', 2);
define('DELAY_BLOCK_COUNT', 6);
define('DB_NAME_PREFIX','ost_explorer_');

//template map
define('contract_internal_transactions', 'transactionList');
define('token_details', 'tokenDetails');
define('blocks', 'home');
define('transaction', 'transactionDetails');
define('block','blockDetail');
define('address_details','addressDetails');
define('home','home');
define('search_results','searchResult');



define('BASE_URL',process.env.BASE_URL);
define('DEFAULT_CHAIN_ID',process.env.DEFAULT_CHAIN_ID);
define('BASE_CONTRACT_ADDRESS',process.env.BASE_CONTRACT_ADDRESS);
define('DEFAULT_DATA_NOT_AVAILABLE_TEXT','Data not available. Please check the input parameters.');

// JWT details
define('JWT_API_SECRET_KEY', process.env.JWT_API_SECRET_KEY);

//Cache
define('CACHING_ENGINE', process.env.OST_CACHING_ENGINE);



define('DEFAULT_MYSQL_HOST', process.env.OV_DEFAULT_MYSQL_HOST);
define('DEFAULT_MYSQL_USER', process.env.OV_DEFAULT_MYSQL_USER);
define('DEFAULT_MYSQL_PASSWORD', process.env.OV_DEFAULT_MYSQL_PASSWORD);


//Basic auth
define('ENVIRONMENT',process.env.NODE_ENV);


define('VIEW_ENVIRONMENT',process.env.OST_VIEW_ENVIRONMENT);
define('VIEW_SUB_ENVIRONMENT',process.env.OST_VIEW_SUB_ENVIRONMENT);

define('PUT_BASIC_AUTHENTICATION',process.env.PUT_BASIC_AUTHENTICATION);

//cloudfront url for fetching assets(js/css)
define("CLOUD_FRONT_BASE_DOMAIN",process.env.CLOUDFRONT_BASE_DOMAIN);

define('MAINNET_BASE_URL',process.env.MAINNET_BASE_URL);
define('TESTNET_BASE_URL',process.env.TESTNET_BASE_URL);

module.exports = constants;