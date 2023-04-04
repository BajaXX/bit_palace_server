module.exports = {
    environments: {
        development: 'development',
        staging: 'staging',
        production: 'production'
    },
    mysql_BITPALACE: {
        host: process.env.MYSQL_BITPALACE_HOST,
        port: process.env.MYSQL_BITPALACE_PORT,
        user: process.env.MYSQL_BITPALACE_USER,
        password: process.env.MYSQL_BITPALACE_PWD,
        database: process.env.MYSQL_BITPALACE_DATABASE
    },
    jwtConfig: {
        secretKey: 'YllWLjWfbSvrNaKQc3NzM98NArW92HXvmpPc',
        expires: 60 * 60 * 24 * 30
    },
    VERIFY_CODE_EXPIRE: 60 * 60 * 24 * 30,

    CHAINS: [
        {
            chainId: 1,
            chainName: 'Ethereum',
            chainShortName: 'eth', // shortname is only for moralis api call
            rpcUrl: 'https://mainnet.infura.io/v3/9e81d78e941b440fbb2560184ab55cad',
            scan_url: 'https://etherscan.io',
            logoUrl: './images/eth.svg'
        },
        {
            chainId: 56,
            chainName: 'BSC',
            chainShortName: 'bsc',
            rpcUrl: 'https://bsc-dataseed4.ninicoin.io',
            scan_url: 'https://www.bscscan.com',
            logoUrl: './images/bnb.svg'
        },
        {
            chainId: 137,
            chainName: 'Polygon',
            chainShortName: 'polygon',
            rpcUrl: 'https://polygon-rpc.com',
            scan_url: 'https://polygonscan.com',
            logoUrl: './images/polygon.svg'
        },
        {
            chainId: 97,
            chainName: 'BSC Testnet',
            chainShortName: 'bsc%20testnet',
            rpcUrl: 'https://nd-773-842-490.p2pify.com/677b8b39b6a1689d7905e3e6f69b9220',
            scan_url: 'https://testnet.bscscan.com',
            logoUrl: './images/bnb.svg'
        }
    ],
    SIGNATURE_DESCRIPTION: 'Welcome to use BitPalace! This is a safe signature, you will login safely with a random nonce: ',

    port: process.env.API_PORT,

    INFURA_API_KEY: '6383aa210bd14e6593a4652e71e012d4',

    MUMBAI_RPC_URL: 'https://polygon-mumbai.infura.io/v3/',

    REWARD_PK: process.env.REWARD_PK,

    WEI: 1000000000000000000
}
