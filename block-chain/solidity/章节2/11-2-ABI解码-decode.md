## ABI Decode
abi.encode将数据编码为bytes.
abi.decode解码bytes回数据。

而ABI解码有1个函数：abi.decode，用于解码abi.encode的数据

abi.encode encodes data into bytes.
abi.decode decodes bytes back into data.

abi.decode用于解码abi.encode生成的二进制编码，将它还原成原本的参数。

我们将abi.encode的二进制编码输入给decode，将解码出原来的参数。
```js
function decode(bytes memory data) public pure returns(uint dx, address daddr, string memory dname, uint[2] memory darray) {
    (dx, daddr, dname, darray) = abi.decode(data, (uint, address, string, uint[2]));
}
```

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AbiDecode {
    struct MyStruct {
        string name;
        uint[2] nums;
    }

    function encode(
        uint x,
        address addr,
        uint[] calldata arr,
        MyStruct calldata myStruct
    ) external pure returns (bytes memory) {
        return abi.encode(x, addr, arr, myStruct);
    }

    function decode(
        bytes calldata data
    )
        external
        pure
        returns (uint x, address addr, uint[] memory arr, MyStruct memory myStruct)
    {
        // (uint x, address addr, uint[] memory arr, MyStruct myStruct) = ...
        (x, addr, arr, myStruct) = abi.decode(data, (uint, address, uint[], MyStruct));
    }
}
```
