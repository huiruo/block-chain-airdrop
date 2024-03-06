## 交易以支付ether。

与 1 美元等于 100 cent 类似，1ether等于 10 18 wei。
```
Transactions are paid with ether.

Similar to how one dollar is equal to 100 cent, one ether is equal to 1018 wei.
```

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EtherUnits {
    uint public oneWei = 1 wei;
    // 1 wei is equal to 1
    bool public isOneWei = 1 wei == 1;

    uint public oneEther = 1 ether;
    // 1 ether is equal to 10^18 wei
    bool public isOneEther = 1 ether == 1e18;
}
```

## ether一笔交易需要支付多少钱？
您支付的gas spent * gas price金额为ether，其中
* gas是一个计算单位
* gas spentgas是一笔交易中使用的总金额
* gas priceether是你愿意为每件支付多少钱gas

Gas 价格较高的交易有更高的优先级被包含在区块中。

未用完的天然气将被退还。

How much ether do you need to pay for a transaction?

You pay gas spent * gas price amount of ether, where

gas is a unit of computation
gas spent is the total amount of gas used in a transaction
gas price is how much ether you are willing to pay per gas

Transactions with higher gas price have higher priority to be included in a block.

Unspent gas will be refunded.

## gas 限制
您可以花费的 Gas 量有 2 个上限
* gas limit（您愿意用于交易的最大 Gas 量，由您设置）
* block gas limit（区块中允许的最大气体量，由网络设置）

There are 2 upper bounds to the amount of gas you can spend

gas limit (max amount of gas you're willing to use for your transaction, set by you)
block gas limit (max amount of gas allowed in a block, set by the network)
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Gas {
    uint public i = 0;

    // Using up all of the gas that you send causes your transaction to fail.
    // State changes are undone.
    // Gas spent are not refunded.
    function forever() public {
        // Here we run a loop until all of the gas are spent
        // and the transaction fails
        while (true) {
            i += 1;
        }
    }
}
```
