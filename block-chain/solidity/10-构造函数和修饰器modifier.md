## 1.构造函数
constructor是一种特殊的函数，每个合约可以定义一个，并在部署合约的时候自动运行一次。它可以用来初始化合约的一些参数，例如初始化合约的owner地址：
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Owner {
   address public owner; // 定义owner变量

   // 构造函数
   constructor() {
      owner = msg.sender; // 在部署合约的时候，将owner设置为部署者的地址
   }

   // 定义modifier
   modifier onlyOwner {
      require(msg.sender == owner); // 检查调用者是否为owner地址
      _; // 如果是的话，继续运行函数主体；否则报错并revert交易
   }

   // 定义一个带onlyOwner修饰符的函数
   function changeOwner(address _newOwner) external onlyOwner{
      owner = _newOwner; // 只有owner地址运行这个函数，并改变owner
   }
}
```

### 1-1.旧版本
Solidity 0.4.22之前，构造函数不使用 constructor 而是使用与合约名同名的函数作为构造函数而使用
```js
pragma solidity =0.4.21;
contract Parents {
    // 与合约名Parents同名的函数就是构造函数
    function Parents () public {
    }
}
```

## 2.修饰器-modifier的主要使用场景是运行函数前的检查，例如地址，变量，余额等
modifier类似于面向对象编程中的decorator

来定义一个叫做onlyOwner的modifier,带有onlyOwner修饰符的函数只能被owner地址调用
```js
// 定义modifier
modifier onlyOwner {
  require(msg.sender == owner); // 检查调用者是否为owner地址
  _; // 如果是的话，继续运行函数主体；否则报错并revert交易
}
```

我们定义了一个changeOwner函数，运行他可以改变合约的owner，但是由于onlyOwner修饰符的存在，只有原先的owner可以调用，别人调用就会报错。这也是最常用的控制智能合约权限的方法。
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Owner {
   address public owner; // 定义owner变量

   // 构造函数
   constructor() {
      owner = msg.sender; // 在部署合约的时候，将owner设置为部署者的地址
   }

   // 定义modifier
   modifier onlyOwner {
      require(msg.sender == owner); // 检查调用者是否为owner地址
      _; // 如果是的话，继续运行函数主体；否则报错并revert交易
   }

   // 定义一个带onlyOwner修饰符的函数
   function changeOwner(address _newOwner) external onlyOwner{
      owner = _newOwner; // 只有owner地址运行这个函数，并改变owner
   }
}
```
