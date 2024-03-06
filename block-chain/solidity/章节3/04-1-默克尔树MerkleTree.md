## Merkle Tree
Merkle Tree，也叫默克尔树或哈希树，是区块链的底层加密技术，被比特币和以太坊区块链广泛采用。

Merkle Tree是一种自下而上构建的加密树，每个叶子是对应数据的哈希，而每个非叶子为它的2个子节点的哈希。
![](../img/树1.png)

Merkle Tree允许对大型数据结构的内容进行有效和安全的验证（Merkle Proof）。对于有N个叶子结点的Merkle Tree，在已知root根值的情况下，验证某个数据是否有效（属于Merkle Tree叶子结点）只需要log(N)个数据（也叫proof），非常高效。

如果数据有误，或者给的proof错误，则无法还原出root根植。 

下面的例子中，叶子L1的Merkle proof为Hash 0-1和Hash 1：

知道这两个值，就能验证L1的值是不是在Merkle Tree的叶子中。为什么呢？ 因为通过叶子L1我们就可以算出Hash 0-0，我们又知道了Hash 0-1，那么Hash 0-0和Hash 0-1就可以联合算出Hash 0，然后我们又知道Hash 1，Hash 0和Hash 1就可以联合算出Top Hash，也就是root节点的hash。

![](../img/树2.png)

## 生成Merkle Tree
我们可以利用网页或者Javascript库merkletreejs来生成Merkle Tree。

这里我们用网页来生成4个地址作为叶子结点的Merkle Tree。叶子结点输入：
```js
[
"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
"0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
]
```

在菜单里选上Keccak-256, hashLeaves和sortPairs选项，然后点击Compute，Merkle Tree就生成好了。Merkle Tree展开为：
```js
└─ 根: eeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097
   ├─ 9d997719c0a5b5f6db9b8ac69a988be57cf324cb9fffd51dc2c37544bb520d65
   │  ├─ 叶子0：5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229
   │  └─ 叶子1：999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb
   └─ 4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c
      ├─ 叶子2：04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54
      └─ 叶子3：dfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486
```
