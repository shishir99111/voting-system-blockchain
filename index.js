const Web3 = require('web3');
const fs = require('fs');
const co = require('co');

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
code = fs.readFileSync('Voting.sol').toString();
const solc = require('solc');

async function contractDeployent() {
  compiledCode = await solc.compile(code);
  // console.log(compiledCode);
  const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
  const VotingContract = await web3.eth.contract(abiDefinition);
  const byteCode = compiledCode.contracts[':Voting'].bytecode;
  const deployedContract = await VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 })
  return VotingContract.at(deployedContract.address);
}

co(contractDeployent).then((contractAddress) => {
  console.log('contractAddress', contractAddress);
})