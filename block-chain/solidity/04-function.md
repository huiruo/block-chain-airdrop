## 1.函数定义
方括号中的是可写可不写的关键字：
```js
function <function name>(<parameter types>) internal|external|public|private [pure|view|payable] [returns (<return types>)]
```

1. `function`：声明函数时的固定用法。要编写函数，就需要以 `function` 关键字开头。

2. `<function name>`：函数名。

3. `(<parameter types>)`：圆括号内写入函数的参数，即输入到函数的变量类型和名称。

4. `{internal|external|public|private}`：函数可见性说明符，共有4种。

    - `public`：内部和外部均可见。
    - `private`：只能从本合约内部访问，继承的合约也不能使用。
    - `external`：只能从合约外部访问（但内部可以通过 `this.f()` 来调用，`f`是函数名）。
    - `internal`: 只能从合约内部访问，继承的合约可以用。

    **注意 1**：合约中定义的函数需要明确指定可见性，它们没有默认值。

    **注意 2**：`public|private|internal` 也可用于修饰状态变量。`public`变量会自动生成同名的`getter`函数，用于查询数值。未标明可见性类型的状态变量，默认为`internal`。

5. `[pure|view|payable]`：决定函数权限/功能的关键字。`payable`（可支付的）很好理解，带着它的函数，运行的时候可以给合约转入ETH。`pure` 和 `view` 的介绍见下面

6. `[returns ()]`：函数返回的变量类型和名称。

## 2.Function Modifier 修饰符
Modifiers are code that can be run before and / or after a function call.
Modifiers can be used to:
* Restrict access
* Validate inputs
* Guard against reentrancy hack

修饰符可用于：
* 限制访问
* 验证输入
* 防止重入黑客攻击
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FunctionModifier {
    // We will use these variables to demonstrate how to use
    // modifiers.
    address public owner;
    uint public x = 10;
    bool public locked;

    constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
    }

    // Modifier to check that the caller is the owner of
    // the contract.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    // Modifiers can take inputs. This modifier checks that the
    // address passed in is not the zero address.
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner validAddress(_newOwner) {
        owner = _newOwner;
    }

    // Modifiers can be called before and / or after a function.
    // This modifier prevents a function from being called while
    // it is still executing.
    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function decrement(uint i) public noReentrancy {
        x -= i;

        if (i > 1) {
            decrement(i - 1);
        }
    }
}
```

## 3.Getter 函数可以声明为view或pure
* View函数声明不会改变任何状态。
* Pure函数声明不会更改或读取任何状态变量。
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ViewAndPure {
    uint public x = 1;

    // Promise not to modify the state.
    function addToX(uint y) public view returns (uint) {
        return x + y;
    }

    // Promise not to modify or read from the state.
    function add(uint i, uint j) public pure returns (uint) {
        return i + j;
    }
}
```

## 到底什么是 `Pure` 和`View`？
solidity引入pure和view关键字主要是为了节省gas和控制函数权限

刚开始学习 `solidity` 时，`pure` 和 `view` 关键字可能令人费解。`solidity` 引入这两个关键字主要是因为 以太坊交易需要支付气费（gas fee）。合约的状态变量存储在链上，gas fee 很贵，如果计算不改变链上状态，就可以不用付 `gas`。包含 `pure` 和 `view` 关键字的函数是不改写链上状态的，因此用户直接调用它们是不需要付 gas 的（注意，合约中非 `pure`/`view` 函数调用 `pure`/`view` 函数时需要付gas）。

在以太坊中，以下语句被视为修改链上状态：

1. 写入状态变量。
2. 释放事件。
3. 创建其他合约。
4. 使用 `selfdestruct`.
5. 通过调用发送以太币。
6. 调用任何未标记 `view` 或 `pure` 的函数。
7. 使用低级调用（low-level calls）。
8. 使用包含某些操作码的内联汇编。

### A-1.pure，中文意思是“纯”
包含pure关键字的函数，不能读取也不能写入存储在链上的状态变量。

### A-2.view，“看”，在solidity里理解为“看客”
包含view关键字的函数，能读取但也不能写入状态变量。

### A-3.不写pure也不写view，函数既可以读取也可以写入状态变量。

### A-4.例子
<!-- [函数例子](./04-2-function.sol) -->
```
04-2-function.sol
```