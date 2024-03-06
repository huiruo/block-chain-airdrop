## 01-如何学习
一、如果只是对区块链感兴趣，想学习基本原理，建议先通读一下《精通比特币》，讲的是比特币的基本原理，其实也就是区块链的基本原理。

去中心化分布式服务器，我觉得解决太多问题，非常看好以太坊

转变开发思维是最大的难点，与传统开发以面向服务为主要关注点不同的是，区块链开发是面向账本和交易。开发者的主要指标不再是高可用高并发的应用程序，而是切换到了面向用户，关注用户友好性和开发扩展性的终端程序开发。区块链终端的核心指标成了安全性、可扩展性、友好性。

区块链开发有几个方向：
* 链开发，就是一个综合领域，硬件，网络,操作系统，加密技术等多种技术融合在一起，需要有相当高的技术能力。
* 链应用开发，主要是利用底层链提供的功能接口开发智能合约以及DAPP，不同链又有不同开发SDK。

如果要自学区块链开发相关知识:
最好以btc或者eth入手,搭建测试网络，了解什么是共识机制、钱包地址、智能合约、rpc接口，以及相关开发工具。

开发语言的工具
* Solidity 文档
* OpenZeppelin
* Chainlink

重要框架
* Hardhat | Ethereum development environment for professionals by Nomic Labs
* Brownie
* DApp Tools
* Remix - Ethereum IDE

高级概念
* NFT
* DAO
* DeFi
* Upgradeability

## 常用区块链编程语言
C++使用率最高，其次是Go

C++的学习成本最高，C++语法丰富而复杂，指针的使用灵活但风险高，程序员还需要自己管理内存的分配和释放，一不小心就会容易导致程序崩溃，这是令很多程序员头疼的事情。而且还有继承和多态等复杂的面向对象程序设计方面的应用，程序的执行有时是动态的（即运行时期的多态，靠方法的重写来实现，也就是使用虚函数），有时甚至不可预料。还有 ，C++支持范式编程，如函数模板和模板类等。但另一方面，C++优越的性能却是其它大多数编程语言无法比拟的，真是令人又爱又恨！Go语言相对于C++，学习成本要低不少，性能虽然不一定能和C++相比美，但相差不是太大。而且Go目前的使用范围也在日渐扩大，所以我认为，Go语言是作为进入区块链行业的首选学习语言。

## 1.C++
### 比特币(BTC)
github： 
https://github.com/bitcoin/bitcoin

### 瑞波币(XRP)
https://github.com/bitcoin/bitcoin

### 恒星币(XLM)
https://github.com/stellar/stellar-core

## 2.go
### eth
https://github.com/ethereum/go-ethereum

以太坊是基于PoW共识算法的公链，但也支持基于PoA共识算法的联盟链或私链。以太坊上的智能合约使用Solidity语言开发，Solidity的语法类似于JavaScript，学习门槛低，易于被掌握和使用

### 超级账本fabric
https://github.com/hyperledger/fabric
说明：fabric是用于联盟链或私链，超级账本可以使用go、java或者nodejs来开发智能合约，其中支持最好的还是go语言

### IPFS(FIL)
https://link.zhihu.com/?target=https%3A//github.com/ipfs/go-ipfs/

### LINK
https://github.com/smartcontractkit/chainlink

## 3.Java
### 波场(TRX)
https://github.com/tronprotocol/java-tron

## 4.js
Javascript 最受欢迎的地方是 web3.js 和 ethereum.js，它们帮助我们连接我们的应用程序前端以连接以太坊网络和智能合约。

