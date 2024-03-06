# 总结
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
