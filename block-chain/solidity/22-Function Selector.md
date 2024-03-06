## Function Selector
调用函数时，前 4 个字节calldata指定要调用哪个函数。

这4个字节称为函数选择器。

以下面这段代码为例。它用于在地址 处call执行transfer合约addr。

When a function is called, the first 4 bytes of calldata specifies which function to call.

This 4 bytes is called a function selector.

Take for example, this code below. It uses call to execute transfer on a contract at the address addr.

```js
addr.call(abi.encodeWithSignature("transfer(address,uint256)", 0xSomeAddress, 123))
```

返回的前 4 个字节abi.encodeWithSignature(....)是函数选择器。

如果您在代码中预先计算并内联函数选择器，也许您可​​以节省少量的gas？

以下是函数选择器的计算方式。

The first 4 bytes returned from abi.encodeWithSignature(....) is the function selector.

Perhaps you can save a tiny amount of gas if you precompute and inline the function selector in your code?

Here is how the function selector is computed.
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FunctionSelector {
    /*
    "transfer(address,uint256)"
    0xa9059cbb
    "transferFrom(address,address,uint256)"
    0x23b872dd
    */
    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}
```
