#!/usr/bin/env node

const program = require('commander');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let messageValue = null;
program
  .usage('<message>')
  .action(function (message) {
    messageValue = message;
  })
  .parse(process.argv);

if (typeof messageValue === 'undefined' || messageValue === null) {
   console.error('no message given!');
   program.outputHelp();
   process.exit(1);
}

const messageByteString = web3.toHex(messageValue);
web3.eth.sendTransaction({
  to: web3.eth.accounts[1],
  from: web3.eth.accounts[0],
  data: messageByteString,
}, (err, address) => {
  if (err) {
    console.log('Unable to save tag.', err);
    return;
  }

  console.log(`Saved tag to eth address: ${address}`);
});
