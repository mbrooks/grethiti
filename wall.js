#!/usr/bin/env node

const program = require('commander');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

program
  .parse(process.argv);

getWallMessagesByAccount(web3, web3.eth.accounts[0]);

function getWallMessagesByAccount(web3, myaccount, startBlockNumber, endBlockNumber) {
  let lastBlockNumber = null;
  if (endBlockNumber == null) {
    endBlockNumber = web3.eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    if (endBlockNumber > 1000) {
      startBlockNumber = endBlockNumber - 1000;
    } else {
      startBlockNumber = 0;
    }
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    processBlock(web3, myaccount, i);
    lastBlockNumber = i;
  }

  setInterval(() => {
    if (lastBlockNumber < web3.eth.blockNumber) {
      processBlock(web3, myaccount, web3.eth.blockNumber, web3.eth.blockNumber);
      lastBlockNumber = web3.eth.blockNumber;
    }
  }, 3*1000);
}

function processBlock(web3, myaccount, i) {
  if (i % 1000 == 0) {
    console.log("Searching block " + i);
  }
  var block = web3.eth.getBlock(i, true);
  if (block != null && block.transactions != null) {
    block.transactions.forEach( function(e) {
      if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
        console.log(
          "  tx hash  : " + e.hash + "\n"
          + "   from    : " + e.from + "\n"
          + "   to      : " + e.to + "\n"
          + "   time    : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
          + "message    : " + web3.toAscii(e.input) + "\n"
        );
      }
    })
  }
}
