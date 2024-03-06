## 总结
delegatecall与call类似，是solidity中地址类型的低级成员函数。delegate中是委托/代表的意思，那么delegatecall委托了什么？

当用户A通过合约B来call合约C的时候，执行的是合约C的函数，语境(Context，可以理解为包含变量和状态的环境)也是合约C的：msg.sender是B的地址，并且如果函数改变一些状态变量，产生的效果会作用于合约C的变量上。

![](../img/委托.png)

而当用户A通过合约B来delegatecall合约C的时候，执行的是合约C的函数，但是语境仍是合约B的：msg.sender是A的地址，并且如果函数改变一些状态变量，产生的效果会作用于合约B的变量上。

![](../img/委托2.png)


大家可以这样理解：一个富商把它的资产（状态变量）都交给一个VC代理（目标合约的函数）来打理。执行的是VC的函数，但是改变的是富商的状态。

和call不一样，delegatecall在调用合约时可以指定交易发送的gas，但不能指定发送的ETH数额

>注意：delegatecall有安全隐患，使用时要保证当前合约和目标合约的状态变量存储结构相同，并且目标合约安全，不然会造成资产损失。

## 1.使用
delegatecall语法和call类似，也是:
```js
目标合约地址.delegatecall(二进制编码);
```
其中二进制编码利用结构化编码函数abi.encodeWithSignature获得：
```js
abi.encodeWithSignature("函数签名", 逗号分隔的具体参数)
```

函数签名为`"函数名（逗号分隔的参数类型)"`。例如`abi.encodeWithSignature("f(uint256,address)", _x, _addr)`。


## 2.什么情况下会用到delegatecall?
目前delegatecall主要有两个应用场景：
1. 代理合约（Proxy Contract）：将智能合约的存储合约和逻辑合约分开：代理合约（Proxy Contract）存储所有相关的变量，并且保存逻辑合约的地址；所有函数存在逻辑合约（Logic Contract）里，通过delegatecall执行。当升级时，只需要将代理合约指向新的逻辑合约即可。
2. EIP-2535 Diamonds（钻石）：钻石是一个支持构建可在生产中扩展的模块化智能合约系统的标准。钻石是具有多个实施合同的代理合同。 

## 3.delegatecall例子
调用结构：你（A）通过合约B调用目标合约C。

### 3-1.被调用的合约C
我们先写一个简单的目标合约C：有两个public变量：num和sender，分别是uint256和address类型；有一个函数，可以将num设定为传入的_num，并且将sender设为msg.sender。
```js
// 被调用的合约C
contract C {
    uint public num;
    address public sender;

    function setVars(uint _num) public payable {
        num = _num;
        sender = msg.sender;
    }
}
```

### 3-2.发起调用的合约B
首先，合约B必须和目标合约C的变量存储布局必须相同，两个变量，并且顺序为num和sender
```js
contract B {
    uint public num;
    address public sender;
```

接下来，我们分别用call和delegatecall来调用合约C的setVars函数，更好的理解它们的区别。

callSetVars函数通过call来调用setVars。它有两个参数`_addr`和`_nume，分别对应合约C的地址和setVars的参数。
```js
// 通过call来调用C的setVars()函数，将改变合约C里的状态变量
function callSetVars(address _addr, uint _num) external payable{
    // call setVars()
    (bool success, bytes memory data) = _addr.call(
        abi.encodeWithSignature("setVars(uint256)", _num)
    );
}
```

而delegatecallSetVars函数通过delegatecall来调用setVars。与上面的callSetVars函数相同，有两个参数_addr和_num，分别对应合约C的地址和setVars的参数。
```js
// 通过delegatecall来调用C的setVars()函数，将改变合约B里的状态变量
function delegatecallSetVars(address _addr, uint _num) external payable{
      // delegatecall setVars()
      (bool success, bytes memory data) = _addr.delegatecall(
          abi.encodeWithSignature("setVars(uint256)", _num)
      );
  }
}
```




