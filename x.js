var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var myAbi = require('./build/contracts/Ehr.json')
console.log(web3.version.api);

var contract = "0xf370936ca437d79f870af746a85dab8882f4d94c";

var MyContract = web3.eth.contract(myAbi.abi);
console.log(web3.eth.accounts);
var myContractInstance = MyContract.at(contract);

myContractInstance.userRegister("ABC", {from: web3.eth.accounts[1], gas:3000000});

console.log(myContractInstance.getBalance({
    from: web3.eth.accounts[1]
}).toString());
