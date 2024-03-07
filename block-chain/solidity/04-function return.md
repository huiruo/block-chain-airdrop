## 1.有多种方法可以从函数返回输出。
公共函数不能接受某些数据类型作为输入或输出

There are several ways to return outputs from a function.

Public functions cannot accept certain data types as inputs or outputs
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Function {
    // Functions can return multiple values.
    function returnMany() public pure returns (uint, bool, uint) {
        return (1, true, 2);
    }

    // Return values can be named.
    function named() public pure returns (uint x, bool b, uint y) {
        return (1, true, 2);
    }

    // Return values can be assigned to their name.
    // In this case the return statement can be omitted.
    function assigned() public pure returns (uint x, bool b, uint y) {
        x = 1;
        b = true;
        y = 2;
    }

    // Use destructuring assignment when calling another
    // function that returns multiple values.
    function destructuringAssignments()
        public
        pure
        returns (uint, bool, uint, uint, uint)
    {
        (uint i, bool b, uint j) = returnMany();

        // Values can be left out.
        (uint x, , uint y) = (4, 5, 6);

        return (i, b, j, x, y);
    }

    // Cannot use map for either input or output

    // Can use array for input
    function arrayInput(uint[] memory _arr) public {}

    // Can use array for output
    uint[] public arr;

    function arrayOutput() public view returns (uint[] memory) {
        return arr;
    }
}

// Call function with key-value inputs
contract XYZ {
    function someFuncWithManyInputs(
        uint x,
        uint y,
        uint z,
        address a,
        bool b,
        string memory c
    ) public pure returns (uint) {}

    function callFunc() external pure returns (uint) {
        return someFuncWithManyInputs(1, 2, 3, address(0), true, "c");
    }

    function callFuncWithKeyValue() external pure returns (uint) {
        return
            someFuncWithManyInputs({a: address(0), b: true, c: "c", x: 1, y: 2, z: 3});
    }
}
```

## 总结
函数输出，包括：返回多种变量，命名式返回，以及利用解构式赋值读取全部和部分返回值。

## 返回值 return和returns
Solidity有两个关键字与函数输出相关：return和returns，他们的区别在于：
* returns加在函数名后面，用于声明返回的变量类型及变量名；
* return用于函数主体中，返回指定的变量。

例子：
声明了returnMultiple()函数将有多个输出：
`returns(uint256, bool, uint256[3] memory)`

接着我们在函数主体中用`return(1, true, [uint256(1),2,5])` 确定了返回值。
```js
// 返回多个变量
function returnMultiple() public pure returns(uint256, bool, uint256[3] memory){
  return(1, true, [uint256(1),2,5]);
}
```

## 命名式返回
我们可以在returns中标明返回变量的名称，这样solidity会自动给这些变量初始化，并且自动返回这些函数的值，不需要加return。

在上面的代码中，我们用`returns(uint256 _number, bool _bool, uint256[3] memory _array)`声明了返回变量类型以及变量名。这样，我们在主体中只需要给变量`_number`，`_bool`和`_array`赋值就可以自动返回了。
```js
// 命名式返回
function returnNamed() public pure returns(uint256 _number, bool _bool, uint256[3] memory _array){
    _number = 2;
    _bool = false; 
    _array = [uint256(3),2,1];
}
```

当然，你也可以在命名式返回中用return来返回变量：
```js
// 命名式返回，依然支持return
function returnNamed2() public pure returns(uint256 _number, bool _bool, uint256[3] memory _array){
    return(1, true, [uint256(1),2,5]);
}
```

## 解构式赋值
solidity使用解构式赋值的规则，支持读取函数的全部或部分返回值。
1. 读取所有返回值：声明变量，并且将要赋值的变量用,隔开，按顺序排列。
```js
uint256 _number;
bool _bool;
uint256[3] memory _array;
(_number, _bool, _array) = returnNamed();
```
2. 读取部分返回值：声明要读取的返回值对应的变量，不读取的留空。下面这段代码中，我们只读取_bool，而不读取返回的_number和_array：
```js
(, _bool2, ) = returnNamed();
```

## 例子
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// 返回多个变量
// 命名式返回
// 解构赋值

contract Return {
    // 返回多个变量
    function returnMultiple() public pure returns(uint256, bool, uint256[3] memory){
        return(1, true, [uint256(1),2,5]);
    }

    // 命名式返回
    function returnNamed() public pure returns(uint256 _number, bool _bool, uint256[3] memory _array){
        _number = 2;
        _bool = false; 
        _array = [uint256(3),2,1];
    }

    // 命名式返回，依然支持return
    function returnNamed2() public pure returns(uint256 _number, bool _bool, uint256[3] memory _array){
        return(1, true, [uint256(1),2,5]);
    }

    // 读取返回值，解构式赋值
    function readReturn() public pure{
        // 读取全部返回值
        uint256 _number;
        bool _bool;
        bool _bool2;
        uint256[3] memory _array;
        (_number, _bool, _array) = returnNamed();
        
        // 读取部分返回值，解构式赋值
        (, _bool2, ) = returnNamed();
    }
}

```