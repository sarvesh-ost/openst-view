#!/usr/bin/env node
"use strict";
/**
 * Job to fetch blocks from the chain and feed them into the provided DB.
 *
 * @example
 * node executables/block_fetcher_cron.js -c 1141
 * @example
 * node executables/block_fetcher_cron.js -h
 *
 * @module executables/block_fetcher_cron
 */

const rootPrefix = "..";

// Load external libraries
// Include Process Locker File
const ProcessLockerKlass = require(rootPrefix + '/lib/process_locker')
  , ProcessLocker = new ProcessLockerKlass()
  , cliHandler = require('commander')
  , MAX_PROCESS_TIME_IN_MINUTES = 21
;

// Load internal files
const logger = require(rootPrefix + "/helpers/custom_console_logger")
  , config = require(rootPrefix + "/config")
  , BlockFetcher = require(rootPrefix + "/lib/block_utils/block_fetcher")
  , BlockKlass = require(rootPrefix + "/app/models/block")
  , version = require(rootPrefix + '/package.json').version
;

// Variables to hold different objects
let block_fetcher;

/**
 * Maintain the state run state
 * @type {hash}
 */
let state = {
  chainID: null,
  blockNumber: -1,
  lastBlock: null
};

let continueExecution = true;

// Using a single function to handle multiple signals
function handle() {
  logger.info('Received Signal');
  continueExecution = false;
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

let startTime = (new Date()).getTime();
/**
 * setFetchBlockCron
 *
 * Methods to set timeout for the fetchBlock api
 *
 * @param {Integer} blockNumber - Number of the block
 * @return {null}
 * @method setFetchBlockCron
 */
const setFetchBlockCron = function (blockNumber) {
  const oThis = this;
  setTimeout(function () {
    if (blockNumber === state.blockNumber) {
      console.log("Killing self...");
      logger.log("Time Diff", (Date.now() - startTime) );
      process.exit(1);
    }

    if (continueExecution && (!state.lastBlock || (blockNumber < state.lastBlock))) {
      state.blockNumber = blockNumber;
      logger.log("Start fetchBlock for blockNumber", blockNumber);
      block_fetcher.fetchAndUpdateBlock(blockNumber)
        .then(function (nextBlockNumber) {
          setFetchBlockCron(nextBlockNumber);
        });
    } else {
      logger.log("cannot start block fetching for blockNumber ", blockNumber);
      logger.log("Time Diff", (Date.now() - startTime) );
      process.exit(1);
    }
  }, config.getPollInterval(state.chainID));
};


/**
 * To handle command line with format
 * It picks up next last inserted block to start the fetching process if the blockNumber is not provided.
 */
cliHandler
  .version(version)
  .usage('Please Specify chain ID \n$>node block_fetcher_cron.js -c <chainID>')
  .option('-c, --chainID <n>', 'Id of the chain', parseInt)
  .option('-n, --blockNumber <n>', 'Start parsing from given block number. If not passed, it start from last inserted block number', parseInt)
  .option('-f, --firstBlock <n>', 'Start parsing from given block number. If not passed, it start from last inserted block number', parseInt)
  .option('-l, --lastBlock <n>', 'Start parsing from given block number. If not passed, it start from last inserted block number', parseInt)
  .parse(process.argv);

// Check if chain id exits
if (!cliHandler.chainID) {
  logger.error('\n\tPlease Specify chain ID \n\t$>node block_fetcher_cron.js -c <chainID>\n');
  process.exit(1);
}

let blockNumberToStartWith = -1;

// Set chain id and block number
state.chainID = cliHandler.chainID;
if (!isNaN(cliHandler.blockNumber)) {
  blockNumberToStartWith = cliHandler.blockNumber;
}

if (cliHandler.firstBlock && cliHandler.lastBlock) {
  blockNumberToStartWith = cliHandler.firstBlock;
  state.lastBlock = cliHandler.lastBlock;
}

let processTitle = 'v_cron_block_fetcher_c_' + cliHandler.chainID;

processTitle += '_n_' + (cliHandler.blockNumber || '') + '_f_' + (cliHandler.firstBlock || '') + '_l_' + (cliHandler.lastBlock || '');

ProcessLocker.canStartProcess({process_title: processTitle});
ProcessLocker.endAfterTime({
  time_in_minutes: MAX_PROCESS_TIME_IN_MINUTES
});

if (!config.isValidChainId(state.chainID)) {
  logger.error('\n\tInvalid chain ID \n');
  process.exit(1);
}

// Create required connections and objects
block_fetcher = BlockFetcher.newInstance(state.chainID);
block_fetcher.state.lastBlock = state.lastBlock;
// logger.log('State Configuration', state);

// Start processing blocks
// If First and last block condition is used, then you need to start verifier and aggregator again.
if (state.lastBlock || blockNumberToStartWith !== -1) {
  if (state.lastBlock && (blockNumberToStartWith >= state.lastBlock)) {
    logger.error('last block is greater than equal to first block');
    process.exit(1);
  }
  setFetchBlockCron(blockNumberToStartWith);
} else {
  new BlockKlass(state.chainID).select('MAX(block_number) as max_block_number').fire()
    .then(function (reponse) {
      const blockNumber = reponse[0]['max_block_number'];
      logger.log("Highest Block Number ", blockNumber,);
      if (blockNumber) {
        blockNumberToStartWith = Number(blockNumber) + 1;
      } else {
        blockNumberToStartWith = 0;
      }
      setFetchBlockCron(blockNumberToStartWith);
    })
    .catch(function (err) {
      logger.error('\nNot able to fetch block number)\n', err);
      process.exit(1);
    });
}