const { ethers } = require('ethers')
const contractABI = require('../abi/BPTToken_ABI.json')

class BPTTokenService {
    constructor(providerUrl, contractAddress, privateKey) {
        // 设置连接节点的 provider
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl)

        // 设置合约地址和 ABI
        this.contract = new ethers.Contract(contractAddress, contractABI, this.provider)

        // 根据私钥生成签名器
        this.signer = new ethers.Wallet(privateKey, this.provider)
    }

    // async reward(toAddress, amount, description) {
    //     const gasLimit = await contract.estimateGas.reward(toAddress, ethers.utils.parseUnits(amount + '', 18), description)
    //     // 打印gas费用
    //     console.log(`Estimated gas limit: ${gasLimit.toString()}`)
    //     // 设置实际 gas 费用（以估计 gas 费用为基础，乘以一个倍数）
    //     const gasPrice = await this.provider.getGasPrice()
    //     console.log(toAddress, gasPrice)
    //     // 构造奖励方法的交易
    //     const tx = await this.contract.connect(this.signer).reward(toAddress, ethers.utils.parseUnits(amount + '', 18), description, {
    //         gasLimit: gasPrice.mul(2)
    //     })

    //     // 发送交易并等待确认
    //     const receipt = await tx.wait()

    //     return receipt
    // }

    async reward(toAddress, amount, description) {
        try {
            // // 估算 gas 费用
            // let gasLimit = await this.contract.estimateGas.reward(toAddress, ethers.utils.parseUnits(amount + '', 18), description)

            // // 如果估算的 gas 限制无法预测，则手动设置较高的 gas 限制
            // if (gasLimit.eq(ethers.constants.MaxUint256)) {
            //     gasLimit = ethers.BigNumber.from('100000') // 设置一个较高的 gas 限制
            //     // const gasPrice = ethers.utils.parseUnits('1', 'gwei');
            // }

            // 设置实际 gas 费用
            const gasPrice = await this.provider.getGasPrice()
            console.log('gasPrice: ', gasPrice, gasPrice.toString())
            // const effectiveGasPrice = gasPrice.mul(1.5) // 设置为估算 gas 费用的 1.5 倍
            const effectiveGasPrice = ethers.utils.parseUnits('1', 'gwei')
            console.log('effectiveGasPrice: ', effectiveGasPrice, effectiveGasPrice.toString())
            // const gasLimit = gasPrice.mul(3)
            // console.log('gasLimit: ' + gasLimit.toString())

            // 构造奖励方法的交易
            const tx = await this.contract.connect(this.signer).reward(toAddress, ethers.utils.parseUnits(amount + '', 18), description, {
                // gasLimit: 7920027,
                gasPrice: gasPrice //ethers.utils.parseUnits('2', 'gwei')
            })

            // 发送交易并等待确认
            const receipt = await tx.wait()

            return receipt
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

module.exports = BPTTokenService
