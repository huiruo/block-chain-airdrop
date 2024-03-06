## Vault
Simple example of vault contract, commonly used in DeFi protocols.

Most vaults on the mainnet are more complex. Here we will focus on the math for calculating shares to mint on deposit and the amount of token to withdraw.

How the contract works
1. Some amount of shares are minted when an user deposits.
2. The DeFi protocol would use the users' deposits to generate yield (somehow).
3. User burn shares to withdraw his tokens + yield.

Vault 合约的简单示例，常用于 DeFi 协议。

主网上的大多数金库都更加复杂。在这里，我们将重点关注计算存款铸造份额和提取代币数量的数学方法。

合同如何运作
1. 当用户存款时，会铸造一定数量的股票。
2. DeFi 协议将使用用户的存款来产生收益（以某种方式）。
3. 用户燃烧股票以提取他的代币+收益。
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vault {
    IERC20 public immutable token;

    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function _mint(address _to, uint _shares) private {
        totalSupply += _shares;
        balanceOf[_to] += _shares;
    }

    function _burn(address _from, uint _shares) private {
        totalSupply -= _shares;
        balanceOf[_from] -= _shares;
    }

    function deposit(uint _amount) external {
        /*
        a = amount
        B = balance of token before deposit
        T = total supply
        s = shares to mint

        (T + s) / T = (a + B) / B 

        s = aT / B
        */
        uint shares;
        if (totalSupply == 0) {
            shares = _amount;
        } else {
            shares = (_amount * totalSupply) / token.balanceOf(address(this));
        }

        _mint(msg.sender, shares);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint _shares) external {
        /*
        a = amount
        B = balance of token before withdraw
        T = total supply
        s = shares to burn

        (T - s) / T = (B - a) / B 

        a = sB / T
        */
        uint amount = (_shares * token.balanceOf(address(this))) / totalSupply;
        _burn(msg.sender, _shares);
        token.transfer(msg.sender, amount);
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed spender, uint amount);
}
```
