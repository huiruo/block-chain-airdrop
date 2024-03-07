## CREATE2
我们介绍了CREATE2操作码的原理，使用方法，并用它完成了极简版的Uniswap并提前计算币对合约地址。CREATE2让我们可以在部署合约前确定它的合约地址，这也是一些layer2项目的基础。

CREATE2 操作码使我们在智能合约部署在以太坊网络之前就能预测合约的地址。Uniswap创建Pair合约用的就是CREATE2而不是CREATE。

这一讲，我将介绍CREATE2的用法:

## 1.CREATE如何计算地址
智能合约可以由其他合约和普通账户利用CREATE操作码创建。 在这两种情况下，新合约的地址都以相同的方式计算：创建者的地址(通常为部署的钱包地址或者合约地址)和nonce(该地址发送交易的总数,对于合约账户是创建的合约总数,每创建一个合约`nonce+1))`的哈希。
```js
新地址 = hash(创建者地址, nonce)
```
创建者地址不会变，但nonce可能会随时间而改变，因此用CREATE创建的合约地址不好预测。

### 1-2.CREATE2如何计算地址
CREATE2的目的是为了让合约地址独立于未来的事件。不管未来区块链上发生了什么，你都可以把合约部署在事先计算好的地址上。

用CREATE2创建的合约地址由4个部分决定：
1. 0xFF：一个常量，避免和CREATE冲突
2. 创建者地址
3. salt（盐）：一个创建者给定的数值
4. 待部署合约的字节码（bytecode）

CREATE2 确保，如果创建者使用 CREATE2 和提供的 salt 部署给定的合约bytecode，它将存储在 新地址 中。

### 1-2.如何使用CREATE2
CREATE2的用法和之前讲的Create类似，同样是new一个合约，并传入新合约构造函数所需的参数，只不过要多传一个salt参数：
```js
Contract x = new Contract{salt: _salt, value: _value}(params)
```
其中Contract是要创建的合约名，x是合约对象（地址），_salt是指定的盐；如果构造函数是payable，可以创建时转入_value数量的ETH，params是新合约构造函数的参数。


## 2.极简Uniswap2
跟上一讲类似，我们用Create2来实现极简Uniswap。

### 2-1.Pair
Pair合约很简单，包含3个状态变量：factory，token0和token1。

构造函数constructor在部署时将factory赋值为工厂合约地址。initialize函数会在Pair合约创建的时候被工厂合约调用一次，将token0和token1更新为币对中两种代币的地址。
```js
contract Pair{
    address public factory; // 工厂合约地址
    address public token0; // 代币1
    address public token1; // 代币2

    constructor() payable {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'UniswapV2: FORBIDDEN'); // sufficient check
        token0 = _token0;
        token1 = _token1;
    }
}
```

### 2-2.PairFactory2
工厂合约（PairFactory2）有两个状态变量getPair是两个代币地址到币对地址的map，方便根据代币找到币对地址；allPairs是币对地址的数组，存储了所有币对地址。

PairFactory2合约只有一个createPair2函数，使用CREATE2根据输入的两个代币地址tokenA和tokenB来创建新的Pair合约。其中
```js
  Pair pair = new Pair{salt: salt}(); 
```

就是利用CREATE2创建合约的代码，非常简单，而salt为token1和token2的hash：
```js
bytes32 salt = keccak256(abi.encodePacked(token0, token1));
```

```js
contract PairFactory2{
  mapping(address => mapping(address => address)) public getPair; // 通过两个代币地址查Pair地址
  address[] public allPairs; // 保存所有Pair地址

  function createPair2(address tokenA, address tokenB) external returns (address pairAddr) {
      require(tokenA != tokenB, 'IDENTICAL_ADDRESSES'); //避免tokenA和tokenB相同产生的冲突
      // 计算用tokenA和tokenB地址计算salt
      (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA); //将tokenA和tokenB按大小排序
      bytes32 salt = keccak256(abi.encodePacked(token0, token1));
      // 用create2部署新合约
      Pair pair = new Pair{salt: salt}(); 
      // 调用新合约的initialize方法
      pair.initialize(tokenA, tokenB);
      // 更新地址map
      pairAddr = address(pair);
      allPairs.push(pairAddr);
      getPair[tokenA][tokenB] = pairAddr;
      getPair[tokenB][tokenA] = pairAddr;
  }
```

### 2-3.事先计算Pair地址
```js
// 提前计算pair合约地址
function calculateAddr(address tokenA, address tokenB) public view returns(address predictedAddress){
    require(tokenA != tokenB, 'IDENTICAL_ADDRESSES'); //避免tokenA和tokenB相同产生的冲突
    // 计算用tokenA和tokenB地址计算salt
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA); //将tokenA和tokenB按大小排序
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    // 计算合约地址方法 hash()
    predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
        bytes1(0xff),
        address(this),
        salt,
        keccak256(type(Pair).creationCode)
    )))));
}
```
