## 1.constant（常量）和immutable（不变量）
状态变量声明这个两个关键字之后，不能在合约后更改数值；并且还可以节省gas。
规则：
* 只有数值变量可以声明constant和immutable；
* string和bytes可以声明为constant，但不能为immutable。

### 1-1.constant
constant变量必须在声明的时候初始化，之后再也不能改变。
```js
// constant变量必须在声明的时候初始化，之后不能改变
uint256 constant CONSTANT_NUM = 10;
string constant CONSTANT_STRING = "0xAA";
bytes constant CONSTANT_BYTES = "WTF";
address constant CONSTANT_ADDRESS = 0x0000000000000000000000000000000000000000;
```

### 1-2.immutable
immutable变量可以在声明时或构造函数中初始化，因此更加灵活。
```js
// immutable变量可以在constructor里初始化，之后不能改变
uint256 public immutable IMMUTABLE_NUM = 9999999999;
address public immutable IMMUTABLE_ADDRESS;
uint256 public immutable IMMUTABLE_BLOCK;
uint256 public immutable IMMUTABLE_TEST;
```

你可以使用全局变量例如address(this)，block.number ，或者自定义的函数给immutable变量初始化。在下面这个例子，我们利用了test()函数给IMMUTABLE_TEST初始化为9：
```js
// 利用constructor初始化immutable变量，因此可以利用
constructor(){
    IMMUTABLE_ADDRESS = address(this);
    IMMUTABLE_BLOCK = block.number;
    IMMUTABLE_TEST = test();
}

function test() public pure returns(uint256){
    uint256 what = 9;
    return(what);
}
```

## 综合例子
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract Constant {
    // constant变量必须在声明的时候初始化，之后不能改变
    uint256 public constant CONSTANT_NUM = 10;
    string public constant CONSTANT_STRING = "0xAA";
    bytes public constant CONSTANT_BYTES = "WTF";
    address public constant CONSTANT_ADDRESS = 0x0000000000000000000000000000000000000000;

    // immutable变量可以在constructor里初始化，之后不能改变
    uint256 public immutable IMMUTABLE_NUM = 9999999999;
    address public immutable IMMUTABLE_ADDRESS;
    uint256 public immutable IMMUTABLE_BLOCK;
    uint256 public immutable IMMUTABLE_TEST;

    // 利用constructor初始化immutable变量，因此可以利用
    constructor(){
        IMMUTABLE_ADDRESS = address(this);
        IMMUTABLE_BLOCK = block.number;
        IMMUTABLE_TEST = test();
    }

    function test() public pure returns(uint256){
        uint256 what = 9;
        return(what);
    }
}
```
