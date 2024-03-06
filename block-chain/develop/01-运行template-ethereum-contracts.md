## command
更新代码请执行:
```bash
cd /xx/hardhat-project/template-ethereum-contracts
pnpm run node
pnpm run deploy
```

template-ethereum-contracts/package.json
```json
{
  "node": "hardhat node",
  "deploy": "pnpm run compile && hardhat deploy",
}
```

### 添加hardhat
```
name:
Hardhat

RPC:
http://127.0.0.1:8545/ 

Chain ID:
31337

Currency symbol:
go
```

## 需要复制 `pnpm run node`运行后的Account Private Key,然后导入到metamask钱包
```bash
➜  template-ethereum-contracts git:(main) ✗ pnpm run node

> mycontracts@0.0.1 node /xx/hardhat-project/template-ethereum-contracts
> hardhat node

Nothing to compile
No need to generate any newer typings.
deploying "SimpleERC20" (tx: 0x34976533fbbd1f5f743cca3dd0f39ed2d0f22fc04026a18a8a58f2ed4a530061)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 1249826 gas
deploying "GreetingsRegistry_Implementation" (tx: 0xca3ed563bb1d1ba35e84059f2f94a27433eee2f2db133744f672215dc64d5153)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 452588 gas
deploying "GreetingsRegistry_Proxy" (tx: 0x69d0f01932a9fad7ea119f0edbc25ae1cd16dfd4d0b6f6b9b7caa7e7c491fd97)...: deployed at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 with 649226 gas
deploying "Counter" (tx: 0x76c9fd474d4be6b4261791bf6d6a8f7dd3719bac47cb74e9f1f27db1f21e22f2)...: deployed at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 with 153619 gas
deploying "FunctionTypes" (tx: 0x26c3bcdadb09a00718ee7a057190f023b210983de8ffa5631e378ed1917c5e1c)...: deployed at 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 with 192457 gas
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 1.路径配置
hardhat.config.ts
```js
// template-ethereum-contracts/hardhat.config.ts
networks: {
  hardhat: {
    saveDeployments: true,
    allowUnlimitedContractSize: true,
    // forking: {
    //   url: "https://mainnet.chainnodes.org/8fe75768-846a-427a-8651-b5c1adf9a1f1",
    // },
    chainId: 31337,
  },
  localhost: {
    saveDeployments: false,
  },
},

paths: {
  sources: 'src',
},
```

## 2.生成的abi
```js
artifacts/src/Counter.sol/Counter.json
```
