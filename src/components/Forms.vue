<template>
  <div class="container">
      <h3> Access {{type}}</h3>
    <div v-if="type === 'payments'">
            <div class="form-inline">
                <input class="form-control" type="number" placeholder="Primary account" v-model="primary">
                <input class="form-control" type="number" placeholder="Secondary account" v-model="secondary">
                <input class="form-control" type="number" placeholder="amount" v-model="amount">
                <button class="btn btn-outline-dark" @click="sendPayment"> Send payment</button>
                <button class="btn btn-outline-dark" @click="requestPayment"> Request payment</button>
                <button class="btn btn-outline-dark" @click="getBalance"> Check Balance </button>
            </div>
    </div>

    <div v-else-if="type === 'control'">
            <div class="row">
                <input class="form-control" type="number" placeholder="Primary account" v-model="primary">
                <input class="form-control" type="number" placeholder="Secondary account" v-model="secondary">
                <button class="btn btn-outline-dark" @click="grantAccess"> Grant Access</button>
                <button class="btn btn-outline-dark" @click="revokeAccess"> Revoke Access</button>
                <button class="btn btn-outline-dark" @click="didIGaveRights"> Did I gave rights</button>
                <button class="btn btn-outline-dark" @click="checkPriviledge"> Verify priviledge</button>
            </div>
    </div>

    <div v-else-if="type === 'registration'">
            <div class="form-inline">
                <input class="form-control" type="number" placeholder="Register your Ethereum address/ pick an account" v-model="primary">
                <input class="form-control" type="text" placeholder="Enter name or description" v-model="name" >
                <button class="btn btn-primary" @click="registerUser">Register</button>
        </div>

    </div>
    <div v-else>
            <h4>Nothing</h4>
        </div>
        <br>
        <br>
        <div class="logging card footer">
            <h6 class="card-subtitle" text-muted>Output: </h6>
            <p class="card-text"> {{output}}</p>
        </div>
   </div>
</template>

<script>
import Web3 from 'web3'
import ehrJson from '../../build/contracts/Ehr.json'

export default {
  data() {
      return {
          type: this.$route.params.type,
          output: 'instead of Console',
          primary: null,
          secondary: null,
          amount: null,
          name: null,
          web3Provider: null,
          web3: null,
          contracts: {},
          account: null,
      }
  },
  mounted() {
      this.getProvider()
    },
  watch: {
      '$route': 'loadForms'
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
                this.output = 'A local network discovered: '+ netId
          })
      },
      loadForms() {
          this.type = this.$route.params.type
          console.log(this.type)
      },
      getBalance(){
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.primary]
            //   console.log(accounts)
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.getBalance({from: this.account})
              }).then((result) => {
                  console.log('Money: ', result)
                  this.output = 'Balance: ' + result.c[0] 
              }).catch((err) => {
                  console.log('You DONT have MONEY: ', err.message)
                  this.output = err.message
              })
          })
      },
      registerUser() {
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.primary]
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.userRegister(this.name, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Registration SucceSS: ', result)
                  this.output ='Registration Successful:  ' + result.tx
              }).catch((err) => {
                  console.log('No registration: ', err.message)
                  this.output = err.message
              })
          })
      },
      sendPayment() {
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.primary]
              var addr = accounts[this.secondary]
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.sendPayment(addr, this.amount, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Sending payment succesfulSS: ', result)
                  this.output ='Sending payment succesful:  ' + result.tx
              }).catch((err) => {
                  console.log('No sending payment: ', err.message)
              })
          })
      },
      requestPayment() {
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.primary]
              var addr = accounts[this.secondary]
              var amount = this.amount
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.requestPayment(addr, amount, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Payment request succesfulSS: ', result)
                  this.output = 'Payment request succesful' + result.tx
              }).catch((err) => {
                  console.log('No payment requested: ', err.message)
                  this.output = err.message
              })
          })
      },
      grantAccess() {
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.primary]
              var addr = accounts[this.secondary]
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.grantAccess(addr, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Access granting SucceSS: ', result)
                  this.output = 'Access granting Successful' + result.tx
              }).catch((err) => {
                  console.log('No access granting: ', err.message)
                  this.output = err.message
              })
          })
      },
      revokeAccess() {
            web3.eth.getAccounts((error, accounts) => {
              if(error) {
                  console.log(error, ': no accounts')
                  return
              }
              this.account = accounts[this.primary]
              var addr = accounts[this.secondary]
              this.contracts.EhrContract.deployed().then((instance) => {
                  var ehrInstance = instance
                  return ehrInstance.revokeAccess(addr, {from: this.account, gas:3000000})
              }).then((result) => {
                  console.log('Access revoking SucceSS: ', result)
                  this.output = 'Revoking access Successful' + result.tx
              }).catch((err) => {
                  console.log('No access revoking: ', err.message)
                  this.output = err.message
              })
          })
      },
      didIGaveRights() {
        web3.eth.getAccounts((error, accounts) => {
            if(error) {
                console.log(error, ': no accounts')
                return
            }
            this.account = accounts[this.primary]
            var addr = accounts[this.secondary]
            this.contracts.EhrContract.deployed().then((instance) => {
                var ehrInstance = instance
                return ehrInstance.didIGaveRights(addr, {from: this.account, gas:3000000})
            }).then((result) => {
                // console.log('Payment request succesfulSS: ', result)
                if(result.c[0] == '1'){ this.output = 'YES: already gave rights'} else {this.output = 'NO: you didnt gave rights'}
            }).catch((err) => {
                console.log('Unsuccessful request: ', err.message)
                this.output = err.message
            })
       })
      },
      checkPriviledge() {
        web3.eth.getAccounts((error, accounts) => {
            if(error) {
                console.log(error, ': no accounts')
                return
            }
            this.account = accounts[this.primary]
            var addr = accounts[this.secondary]
            this.contracts.EhrContract.deployed().then((instance) => {
                var ehrInstance = instance
                return ehrInstance.verifyPriviledge(accounts[this.primary], addr, {from: this.account, gas:3000000})
            }).then((result) => {
                // console.log('Payment request succesfulSS: ', result)
                if(result){ this.output = 'YES priviledged'} else {this.output = 'Not priviledged'}
                // this.yes = 
            }).catch((err) => {
                console.log('Unsuccesful request: ', err.message)
                this.output = err.message
            })
       })
      }

  },
  created() {
      this.loadForms()
  }
}
</script>
