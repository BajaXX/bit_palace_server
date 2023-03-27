const ethUtil = require('ethereumjs-util')
const blockies = require('ethereum-blockies-png')
const { ethers, BigNumber } = require('ethers')
const { CHAINS } = require('../config')
const nft = require('../abi/nft.json')
const erc20 = require('../abi/erc20.json')

const RPC_URL = 'https://mainnet.infura.io/v3/9e81d78e941b440fbb2560184ab55cad' // Must be ethereum RPC
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = provider.getSigner()

const recoverAddress = (msg, signature) => {
    const msgHex = ethUtil.bufferToHex(Buffer.from(msg))
    // Check if signature is valid
    const msgBuffer = ethUtil.toBuffer(msgHex)
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer)
    const signatureBuffer = ethUtil.toBuffer(signature)
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer)
    const publicKey = ethUtil.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s)
    const addresBuffer = ethUtil.publicToAddress(publicKey)
    return ethUtil.bufferToHex(addresBuffer)
}

const blockieDataURL = (address) =>
    blockies.createDataURL({
        seed: address,
        scale: 8 // width/height of each block in pixels, default:
    })

const verifyAccount = (address) => {
    try {
        return ethers.utils.getAddress(address)
    } catch (e) {
        return false
    }
}

const ensAddress = async (ens) => await signer.resolveName(ens)

const ensName = async (address) => {
    const _ensName = await provider.lookupAddress(address)
    return _ensName
}

const getRPCUrl = (chainId) => {
    let re = ''
    for (let i = 0; i < CHAINS.length; i++) {
        if (CHAINS[i].chainId === chainId) {
            re = CHAINS[i].rpcUrl
            break
        }
    }
    return re
}

const getNftBalance = async (chainId, nftAddress, account) => {
    try {
        const rpcUrl = getRPCUrl(chainId)
        console.log('nftAddress', nftAddress, rpcUrl)
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const erc721Contract = new ethers.Contract(nftAddress, nft, provider)
        const balance = await erc721Contract.balanceOf(account)
        // console.log('nft balance', balance);
        return balance
    } catch (err) {
        console.log(err)
        return ethers.BigNumber.from(0)
    }
}

const getTokenBalance = async (chainId, tokenAddress, account) => {
    try {
        const rpcUrl = getRPCUrl(chainId)
        console.log(rpcUrl)
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const erc20Contract = new ethers.Contract(tokenAddress, erc20, provider)
        const balance = await erc20Contract.balanceOf(account)
        // console.log('token balance', balance);
        return balance
    } catch (err) {
        console.log(err)
        return ethers.BigNumber.from(0)
    }
}

const getNftInfoByChainId = async (chainId, nftAddress) => {
    try {
        console.log('chainId', chainId)
        const rpc = getRPCUrl(chainId)
        console.log('rpc', rpc)
        const provider = new ethers.providers.JsonRpcProvider(rpc)
        const erc721Contract = new ethers.Contract(nftAddress, nft, provider)
        return { name: await erc721Contract.name(), symbol: await erc721Contract.symbol() }
    } catch (err) {
        return false
    }
}

const getTokenInfoByChainId = async (chainId, tokenAddress) => {
    try {
        const rpc = getRPCUrl(chainId)
        const provider = new ethers.providers.JsonRpcProvider(rpc)
        const erc20Contract = new ethers.Contract(tokenAddress, erc20, provider)
        return { name: await erc20Contract.name(), symbol: await erc20Contract.symbol() }
    } catch (err) {
        return false
    }
}
const toWei = (ether) => ethers.utils.parseEther(ether)
const fromWei = (wei) => ethers.utils.formatEther(wei)
const toBigNumber = (num) => ethers.BigNumber.from(num)

module.exports = {
    recoverAddress,
    blockieDataURL,
    verifyAccount,
    getNftBalance,
    getTokenBalance,
    toWei,
    fromWei,
    toBigNumber,
    getNftInfoByChainId,
    getTokenInfoByChainId
}
