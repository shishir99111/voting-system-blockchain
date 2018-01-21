const path = require('path');
const fs = require('fs');
const co = require('co');
const Web3 = require('web3');
const solc = require('solc');

require('dotenv').config({ path: path.join(__dirname, '/.env') });

web3 = new Web3(new Web3.providers.HttpProvider(process.env.provider));
code = fs.readFileSync('Voting.sol').toString();

async function contractDeployent() {
  try {
    const contestant = process.env.contestant.split(',');
    compiledCode = await solc.compile(code);
    const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
    console.log(abiDefinition);
    const VotingContract = await web3.eth.contract(abiDefinition);
    const byteCode = compiledCode.contracts[':Voting'].bytecode;
    const deployedContract = await VotingContract.new(contestant, { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 })
    return deployedContract;
  } catch (e) {
    throw e;
  }
}

co(contractDeployent).then((deployedContract) => {
  const contractInstance = VotingContract.at(deployedContract);
  console.log(`Contract is Deployed at ${deployedContract.address}`);
}).catch((e) => {
  throw e;
});