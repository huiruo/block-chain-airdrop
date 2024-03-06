## 总结
介绍什么是哈希函数，以及如何使用solidity最常用的哈希函数keccak256

哈希函数（hash function）是一个密码学概念，它可以将任意长度的消息转换为一个固定长度的值，这个值也称作哈希（hash）。

## 1.Hash的性质-Hash的应用
一个好的哈希函数应该具有以下几个特性：
* 单向性：从输入的消息到它的哈希的正向运算简单且唯一确定，而反过来非常难，只能靠暴力枚举。
* 灵敏性：输入的消息改变一点对它的哈希改变很大。
* 高效性：从输入的消息到哈希的运算高效。
* 均一性：每个哈希值被取到的概率应该基本相等。
* 抗碰撞性：
  - 弱抗碰撞性：给定一个消息x，找到另一个消息x'使得hash(x) = hash(x')是困难的。
  - 强抗碰撞性：找到任意x和x'，使得hash(x) = hash(x')是困难的。

Hash的应用
* 生成数据唯一标识
* 加密签名
* 安全加密

## 3.Keccak256,使用 Keccak256 进行哈希处理
Keccak256函数是solidity中最常用的哈希函数，用法非常简单：
```js
哈希 = keccak256(数据);
```

keccak256计算输入的 Keccak-256 哈希值。
一些用例是：
* 根据输入创建确定性唯一 ID
* 提交-揭示方案
* 紧凑的加密签名（通过签署散列而不是更大的输入）
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HashFunction {
    function hash(
        string memory _text,
        uint _num,
        address _addr
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_text, _num, _addr));
    }

    // Example of hash collision
    // Hash collision can occur when you pass more than one dynamic data type
    // to abi.encodePacked. In such case, you should use abi.encode instead.
    function collision(
        string memory _text,
        string memory _anotherText
    ) public pure returns (bytes32) {
        // encodePacked(AAA, BBB) -> AAABBB
        // encodePacked(AA, ABBB) -> AAABBB
        return keccak256(abi.encodePacked(_text, _anotherText));
    }
}

contract GuessTheMagicWord {
    bytes32 public answer =
        0x60298f78cc0b47170ba79c10aa3851d7648bd96f2f8e46a19dbc777c36fb0c00;

    // Magic word is "Solidity"
    function guess(string memory _word) public view returns (bool) {
        return keccak256(abi.encodePacked(_word)) == answer;
    }
}
```

## 4.Keccak256和sha3
这是一个很有趣的事情：
1. sha3由keccak标准化而来，在很多场合下Keccak和SHA3是同义词，但在2015年8月SHA3最终完成标准化时，NIST调整了填充算法。所以SHA3就和keccak计算的结果不一样，这点在实际开发中要注意。

2. 以太坊在开发的时候sha3还在标准化中，所以采用了keccak，所以Ethereum和Solidity智能合约代码中的SHA3是指Keccak256，而不是标准的NIST-SHA3，为了避免混淆，直接在合约代码中写成Keccak256是最清晰的。

## 5.生成数据唯一标识
我们可以利用keccak256来生成一些数据的唯一标识。比如我们有几个不同类型的数据：uint，string，address，我们可以先用abi.encodePacked方法将他们打包编码，然后再用keccak256来生成唯一标识：
```js
function hash(
    uint _num,
    string memory _string,
    address _addr
) public pure returns (bytes32) {

    return keccak256(abi.encodePacked(_num, _string, _addr));
}
```

## 6.弱抗碰撞性
我们用keccak256演示一下之前讲到的弱抗碰撞性，即给定一个消息x，找到另一个消息x'使得hash(x) = hash(x')是困难的。

大家可以试个10次，看看能不能幸运的碰撞上。

我们给定一个消息0xAA，试图去找另一个消息，使得它们的哈希值相等：
```js
// 弱抗碰撞性
function weak(
    string memory string1
)public view returns (bool){
    return keccak256(abi.encodePacked(string1)) == _msg;
}
```

## 7.强抗碰撞性
我们用keccak256演示一下之前讲到的强抗碰撞性，即找到任意不同的x和x'，使得hash(x) = hash(x')是困难的。

大家可以试个10次，看看能不能幸运的碰撞上。

我们构造一个函数strong，接收两个不同的string参数string1和string2，然后判断它们的哈希是否相同：
```js
// 强抗碰撞性
function strong(
    string memory string1,
    string memory string2
)public pure returns (bool){
    return keccak256(abi.encodePacked(string1)) == keccak256(abi.encodePacked(string2));
}
```
