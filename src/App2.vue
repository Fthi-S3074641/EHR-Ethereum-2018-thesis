<template>
  <div id="app" >

<div class="col-md-8">
        <div class="form-inline">
            <input class="form-control" type="number" placeholder="Primary account" v-model="index">
            <input class="form-control" type="number" placeholder="Secondary account" v-model="index2">
            <button class="btn btn-primary" @click="registerUser">Register</button>
        </div>
<br>
        <div class="card">
            <div class="card-block">
                <h4 class="card-title"> {{ yes }}</h4>
                <h6 class="card-subtitle mb-2 text-muted">{{balance}}</h6>
                <p class="card-text"> {{logg}}</p>
            </div>                
        </div>
        <br>
    <div class="card">
            <div class="form-inline">
            <button class="btn btn-outline-dark" @click="grantAccess"> Grant Access</button>
            <button class="btn btn-outline-dark" @click="revokeAccess"> Revoke Access</button>
            <button class="btn btn-outline-dark" @click="didIGaveRights"> Did I gave rights</button>
            <button class="btn btn-outline-dark" @click="checkPriviledge"> Verify priviledge</button>
            </div>
    </div>

    <br>
    <div class="card">
            <div class="form-inline">
            <input class="form-control" type="number" placeholder="amount" v-model="amount">
            <button class="btn btn-outline-dark" @click="sendPayment"> Send $$</button>
            <button class="btn btn-outline-dark" @click="requestPayment"> Request $$</button>
            <button class="btn btn-outline-dark" @click="getBalance"> Check $$ </button>
            </div>
    </div>

</div>

  </div>
</template>

<script>
import Web3 from 'web3'
import ehrJson from '../build/contracts/Ehr.json'

export default {
    data() {       
    return {
        web3Provider: null,
        web3: null,
        contracts: {},
        account: null,
        balance: 'to display result',
        index: null,
        index2: null,
        amount: null,
        yes: 'Reporting tool',
        logg: 'instead of console'

    }
    },
    mounted() {
        this.getProvider()
    },
    methods: {
      getProvider() {
          this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
          web3 = new Web3(this.web3Provider)
          this.getContract()
      },
      getContract() {
          this.contracts.EhrContract  = this.$TruffleContract(ehrJson)
          this.contracts.EhrContract.setProvider(this.web3Provider)
          this.networkCheck()
      },
      networkCheck() {
          web3.version.getNetwork((err, netId) => {
              if(err){
                  console.log(err, 'First')
                  return
              }
                console.log('My man: This is an unknown network.', netId)
          })
      },
      getBalance(adopters, account, index) {
          web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.index]
            //   console.log(accounts)
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.getBalance({from: this.account})
              }).then((result) => {
                  console.log('Money: ', result)
                  this.balance = result.c[0]
              }).catch((err) => {
                  console.log('You DONT have MONEY: ', err.message)
              })
          })
      },
      registerUser(){
          
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.index]
              var name = "Ftalem"
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.userRegister(name, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Registration SucceSS: ', result)
                  this.logg ='Success'
              }).catch((err) => {
                  console.log('No registration: ', err.message)
              })
          })
      },
      grantAccess(){     
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.index]
              var addr = accounts[this.index2]
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.grantAccess(addr, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Access granting SucceSS: ', result)
                  this.logg = 'Success'
              }).catch((err) => {
                  console.log('No access granting: ', err.message)
              })
          })
      },
      revokeAccess(){
          
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.index]
              var addr = accounts[this.index2]
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.revokeAccess(addr, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Access revoking SucceSS: ', result)
                  this.logg = 'Success'
              }).catch((err) => {
                  console.log('No access revoking: ', err.message)
              })
          })
      },
      sendPayment(){
          
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.index]
              var addr = accounts[this.index2]
              var amount = this.amount
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.sendPayment(addr, amount, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Sending payment succesfulSS: ', result)
                  this.logg = 'Success'
              }).catch((err) => {
                  console.log('No sending payment: ', err.message)
              })
          })
      },
      requestPayment(){
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.index]
              var addr = accounts[this.index2]
              var amount = this.amount
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.requestPayment(addr, amount, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Payment request succesfulSS: ', result)
                  this.logg = 'Success'
              }).catch((err) => {
                  console.log('No payment requested: ', err.message)
              })
          })
      },
      didIGaveRights(){
        web3.eth.getAccounts((error, accounts) => {
            if(error) {
                console.log(error, ': no accounts')
                return
            }
        this.account = accounts[this.index]
        var addr = accounts[this.index2]
        this.contracts.EhrContract.deployed().then((instance) => {
            var ehrInstance = instance
            return ehrInstance.didIGaveRights(addr, {from: this.account, gas:3000000})
        }).then((result) => {
            // console.log('Payment request succesfulSS: ', result)
            if(result.c[0] == '1'){ this.yes = 'yes you gave rights'} else {this.yes = 'No you didnt gave rights'}
            // this.yes = 
        }).catch((err) => {
            console.log('Unsuccessful request: ', err.message)
        })
       })
      },
      checkPriviledge(){
        web3.eth.getAccounts((error, accounts) => {
            if(error) {
                console.log(error, ': no accounts')
                return
            }
        this.account = accounts[this.index]
        var addr = accounts[this.index2]
        this.contracts.EhrContract.deployed().then((instance) => {
            var ehrInstance = instance
            return ehrInstance.verifyPriviledge(accounts[this.index], addr, {from: this.account, gas:3000000})
        }).then((result) => {
            // console.log('Payment request succesfulSS: ', result)
            if(result){ this.yes = 'yes priviledged'} else {this.yes = 'Not priviledged'}
            // this.yes = 
        }).catch((err) => {
            console.log('Unsuccesful request: ', err.message)
        })
       })
      }
    }
}
</script>

