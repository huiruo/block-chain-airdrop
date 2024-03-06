## 不可变变量就像常量。不可变变量的值可以在构造函数内设置，但之后不能修改。
```
Immutable variables are like constants. Values of immutable variables can be set inside the constructor but cannot be modified afterwards.
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Constants {
    // coding convention to uppercase constant variables
    address public constant MY_ADDRESS = 0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT = 123;
}
```
