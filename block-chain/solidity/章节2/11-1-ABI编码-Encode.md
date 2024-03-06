## 1.总结
在以太坊中，数据必须编码成字节码才能和智能合约交互。这一讲，我们介绍了4种abi编码方法和1种abi解码方法。

ABI (Application Binary Interface，应用二进制接口)是与以太坊智能合约交互的标准。数据基于他们的类型编码；并且由于编码后不包含类型信息，解码时需要注明它们的类型。

### 1-2.ABI的使用场景
1. 在合约开发中，ABI常配合call来实现对合约的底层调用。
```js
bytes4 selector = contract.getValue.selector;

bytes memory data = abi.encodeWithSelector(selector, _x);
(bool success, bytes memory returnedData) = address(contract).staticcall(data);
require(success);

return abi.decode(returnedData, (uint256));
```

2. ethers.js中常用ABI实现合约的导入和函数调用。
```js
const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
/*
    * Call the getAllWaves method from your Smart Contract
    */
const waves = await wavePortalContract.getAllWaves();
```

3. 对不开源合约进行反编译后，某些函数无法查到函数签名，可通过ABI进行调用。


Solidity中，ABI编码有4个函数：
* abi.encode
* abi.encodePacked
* abi.encodeWithSignature
* abi.encodeWithSelector。

## 2.ABI编码-ABI Encode
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address, uint) external;
}

contract Token {
    function transfer(address, uint) external {}
}

contract AbiEncode {
    function test(address _contract, bytes calldata data) external {
        (bool ok, ) = _contract.call(data);
        require(ok, "call failed");
    }

    function encodeWithSignature(
        address to,
        uint amount
    ) external pure returns (bytes memory) {
        // Typo is not checked - "transfer(address, uint)"
        return abi.encodeWithSignature("transfer(address,uint256)", to, amount);
    }

    function encodeWithSelector(
        address to,
        uint amount
    ) external pure returns (bytes memory) {
        // Type is not checked - (IERC20.transfer.selector, true, amount)
        return abi.encodeWithSelector(IERC20.transfer.selector, to, amount);
    }

    function encodeCall(address to, uint amount) external pure returns (bytes memory) {
        // Typo and type errors will not compile
        return abi.encodeCall(IERC20.transfer, (to, amount));
    }
}
```

## 1.ABI编码
我们将用编码4个变量，他们的类型分别是
* uint256
* address 
* string
* uint256[2]
```js
uint x = 10;
address addr = 0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71;
string name = "0xAA";
uint[2] array = [5, 6]; 
```

### 1-2.abi.encode
将给定参数利用ABI规则编码。ABI被设计出来跟智能合约交互，他将每个参数填充为32字节的数据，并拼接在一起。

如果你要和合约交互，你要用的就是abi.encode。
```js
function encode() public view returns(bytes memory result) {
    result = abi.encode(x, addr, name, array);
}
```

结果：由于abi.encode将每个数据都填充为32字节，中间有很多0。
```
0x000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000007a58c0be72be218b41c608b7fe7c5bb630736c7100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000043078414100000000000000000000000000000000000000000000000000000000
```

### 1-3.abi.encodePacked
将给定参数根据其所需最低空间编码。它类似 abi.encode，但是会把其中填充的很多0省略。比如，只用1字节来编码uint类型。当你想省空间，并且不与合约交互的时候，可以使用abi.encodePacked，例如算一些数据的hash时。
```js
function encodePacked() public view returns(bytes memory result) {
    result = abi.encodePacked(x, addr, name, array);
}
```
编码的结果为，由于abi.encodePacked对编码进行了压缩，长度比abi.encode短很多。
```
0x000000000000000000000000000000000000000000000000000000000000000a7a58c0be72be218b41c608b7fe7c5bb630736c713078414100000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006
```

### 1-4.abi.encodeWithSignature
与abi.encode功能类似，只不过第一个参数为函数签名，比如"foo(uint256,address)"。当调用其他合约的时候可以使用。
```js
function encodeWithSignature() public view returns(bytes memory result) {
    result = abi.encodeWithSignature("foo(uint256,address,string,uint256[2])", x, addr, name, array);
}
```

等同于在abi.encode编码结果前加上了4字节的函数选择器说明；

说明: 函数选择器就是通过函数名和参数进行签名处理(Keccak–Sha3)来标识函数，可以用于不同合约之间的函数调用;结果:
```
0xe87082f1000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000007a58c0be72be218b41c608b7fe7c5bb630736c7100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000043078414100000000000000000000000000000000000000000000000000000000
```

### 1-5.abi.encodeWithSelector
与abi.encodeWithSignature功能类似，只不过第一个参数为函数选择器，为函数签名Keccak哈希的前4个字节。
```js
function encodeWithSelector() public view returns(bytes memory result) {
        result = abi.encodeWithSelector(bytes4(keccak256("foo(uint256,address,string,uint256[2])")), x, addr, name, array);
}
```

与abi.encodeWithSignature结果一样,编码的结果为:
```
0xe87082f1000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000007a58c0be72be218b41c608b7fe7c5bb630736c7100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000043078414100000000000000000000000000000000000000000000000000000000
```
