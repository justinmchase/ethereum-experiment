import Web3 from 'web3'
import auto from 'async/auto'

function executeWithRetry (λ) {
  return function (callback) {
    let timeout = 0
    function error (err) {
      timeout++
      if (timeout > 10) {
        console.error(`Too many errors during startup, giving up.`)
        callback(err)
      } else {
        let interval = (timeout ^ 2)
        console.error(`Error during startup, retrying in ${interval}s (${err.message})`)
        setTimeout(execute, interval * 1000)
      }
    }
    function execute () {
      try {
        λ((err, result) => {
          if (err) return error(err)
          callback(null, result)
        })
      } catch (err) {
        error(err)
      }
    }
    execute()
  }
}

function initializeWeb3 (callback) {
  let web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

  let coinbase = web3.eth.defaultAccount = web3.eth.coinbase
  let balance = web3.eth
    .getBalance(coinbase)
    .toNumber()

  console.log(`balance: ${balance}`)
  callback(null, web3)
}


export default function (callback) {
  let block = {
    web3: executeWithRetry(initializeWeb3)
  }

  auto(block, callback)
}
