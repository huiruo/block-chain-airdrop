## receive()和fallback()，他们主要在两种情况下被使用：
[参考](https://www.wtf.academy/docs/solidity-102/Fallback/)

* 接收ETH

* 处理合约中不存在的函数调用（代理合约proxy contract）

> 在solidity 0.6.x版本之前，语法上只有 fallback() 函数，用来接收用户发送的ETH时调用以及在被调用函数签名没有匹配到时，来调用。 0.6版本之后，solidity才将 fallback() 函数拆分成 receive() 和 fallback() 两个函数。

## receive和fallback的区别
receive和fallback都能够用于接收ETH，他们触发的规则如下：

```
触发fallback() 还是 receive()?

           接收ETH
              |
         msg.data是空？
            /  \
          是    否
          /      \
receive()存在?   fallback()
        / \
       是  否
      /     \
receive()   fallback()
```

合约接收ETH时，msg.data为空且存在receive()时，会触发receive()；msg.data不为空或不存在receive()时，会触发fallback()，此时fallback()必须为payable。

receive()和payable fallback()均不存在的时候，向合约直接发送ETH将会报错（你仍可以通过带有payable的函数向合约发送ETH）。


## 1.receive
receive()只用于处理接收ETH。一个合约最多有一个receive()函数，声明方式与一般函数不一样，不需要function关键字：

```js
receive() external payable { ... }
```

receive()函数不能有任何的参数，不能返回任何值，必须包含external和payable

当合约接收ETH的时候，receive()会被触发。receive()最好不要执行太多的逻辑因为如果别人用send和transfer方法发送ETH的话，gas会限制在2300，receive()太复杂可能会触发Out of Gas报错；如果用call就可以自定义gas执行更复杂的逻辑

例子：在receive()里发送一个event:

```js
// 定义事件
event Received(address Sender, uint Value);
// 接收ETH时释放Received事件
receive() external payable {
    emit Received(msg.sender, msg.value);
}
```

## 2.fallback
fallback()函数会在调用合约不存在的函数时被触发。可用于接收ETH，也可以用于代理合约proxy contract。`fallback()`声明时不需要function关键字，必须由external修饰，一般也会用payable修饰，用于接收ETH:`fallback() external payable { ... }`

例子:
我们定义一个fallback()函数，被触发时候会释放fallbackCalled事件，并输出msg.sender，msg.value和msg.data:

```js
// fallback
fallback() external payable{
    emit fallbackCalled(msg.sender, msg.value, msg.data);
}
```
