require('chai')
  .use(require('bn-chai')(web3.utils.BN))
  .use(require('chai-as-promised'))
.should()

const { toWei, toBN } = require('web3-utils')

const { takeSnapshot, revertSnapshot, mineBlock } = require('../scripts/ganacheHelper')

const Wallet = artifacts.require('./Wallet.sol')
const CEther = artifacts.require('./CEther.sol')
const Pool = artifacts.require('./EthStakingPool.sol')
const COMPOUND_ETH_CONTRACT = '0x42a628e0c5f3767930097b34b08dcf77e78e4f2b'

contract('Wallet', async accounts => {
  let snapshotId
  let cEther
  let wallet
  let pool
  const owner = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]
  const user3 = accounts[3]
  const demomination = toBN(toWei('1'))


  before(async () => {
    cEther = await CEther.at(COMPOUND_ETH_CONTRACT)
    pool = await Pool.deployed()
    wallet = await Wallet.new(COMPOUND_ETH_CONTRACT, demomination, pool.address)
    snapshotId = await takeSnapshot()
  })

  describe('constructor', function () {
    it('should be connected to ropsten', async function () {
      const admin = await cEther.admin()
      admin.should.be.equal('0x9C1856636d78C051deAd6CAB9c5699e4E25549e9')
    })
  })

  describe('compound test', function () {
    it('mint', async function () {
      const { logs } = await cEther.mint({ value: demomination })
      console.log('logs', logs)
    })
  })

  describe('deposit', function () {
    it('should work', async function () {
      const balanceWaletBefore = await web3.eth.getBalance(wallet.address)
      const balanceCompoundBefore = await web3.eth.getBalance(cEther.address)
      await wallet.enter({ value: demomination, from: user1 })
      const balanceWaletAfter = await web3.eth.getBalance(wallet.address)
      const balanceCompoundAfter = await web3.eth.getBalance(cEther.address)

      balanceCompoundAfter.should.be.eq.BN(toBN(balanceCompoundBefore).add(demomination))
      balanceWaletBefore.should.be.eq.BN(toBN(balanceWaletAfter))
    })
  })

  describe('withdraw', function () {
    it('should work', async function () {
      await wallet.enter({ value: demomination, from: user1 })
      const balanceWaletBefore = await web3.eth.getBalance(wallet.address)
      const balanceCompoundBefore = await web3.eth.getBalance(cEther.address)
      const balanceUserBefore = await web3.eth.getBalance(user1)
      await wallet.exit({ from: user1, gasPrice: 0 })
      const balanceUserAfter = await web3.eth.getBalance(user1)
      const balanceWaletAfter = await web3.eth.getBalance(wallet.address)
      const balanceCompoundAfter = await web3.eth.getBalance(cEther.address)

      balanceCompoundAfter.should.be.eq.BN(toBN(balanceCompoundBefore).sub(demomination))
      balanceWaletBefore.should.be.eq.BN(toBN(balanceWaletAfter))
      balanceUserAfter.should.be.eq.BN(toBN(balanceUserBefore).add(demomination))
    })
  })

  describe('withdrawInterest', function () {
    it.only('should work', async function () {
      await wallet.enter({ value: demomination, from: user1 })
      await mineBlock()

      const balance = await cEther.balanceOfUnderlying.call(wallet.address)
      console.log('balance', balance.toString())

      let interest = await wallet.interest.call()
      console.log('interest', interest.toString())
      await mineBlock()
      interest = await wallet.interest.call()
      console.log('interest', interest.toString())
      await mineBlock()
      interest = await wallet.interest.call()
      console.log('interest', interest.toString())
      await mineBlock()
      interest = await wallet.interest.call()
      console.log('interest', interest.toString())
      await mineBlock()
      interest = await wallet.interest.call()
      console.log('interest', interest.toString())
      await wallet.exit({ from: user1 })

      const balanceWaletBefore = await web3.eth.getBalance(wallet.address)
      const balanceCompoundBefore = await web3.eth.getBalance(cEther.address)
      const balancePoolBefore = await web3.eth.getBalance(pool.address)
      console.log('balancepoolBefore', balancePoolBefore.toString())
      await wallet.withdrawInterest({ gasPrice: 0 })
      const balancePoolAfter = await web3.eth.getBalance(pool.address)
      console.log('balancepoolAfter', balancePoolAfter.toString())
      const balanceWaletAfter = await web3.eth.getBalance(wallet.address)
      const balanceCompoundAfter = await web3.eth.getBalance(cEther.address)

      // balanceCompoundAfter.should.be.eq.BN(toBN(balanceCompoundBefore).sub(interest))
      balanceWaletBefore.should.be.eq.BN(toBN(balanceWaletAfter))
      balancePoolAfter.should.be.gte.BN(toBN(balancePoolBefore).add(interest))
    })
  })

  afterEach(async () => {
    await revertSnapshot(snapshotId.result)
    snapshotId = await takeSnapshot()
  })
})
