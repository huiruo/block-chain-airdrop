## 1.if-else
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IfElse {
    function foo(uint x) public pure returns (uint) {
        if (x < 10) {
            return 0;
        } else if (x < 20) {
            return 1;
        } else {
            return 2;
        }
    }

    function ternary(uint _x) public pure returns (uint) {
        // if (_x < 10) {
        //     return 1;
        // }
        // return 2;

        // shorthand way to write if / else statement
        // the "?" operator is called the ternary operator
        return _x < 10 ? 1 : 2;
    }
}
```

```js
function ifElseTest(uint256 _number) public pure returns(bool){
    if(_number == 0){

      return(true);
    }else{

      return(false);
    }
}
```

## 2.for
不要编写无限制的循环，因为这可能会达到气体限制，导致交易失败。

由于上述原因，很少使用whileand循环。do while

Don't write loops that are unbounded as this can hit the gas limit, causing your transaction to fail.

For the reason above, while and do while loops are rarely used.
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Loop {
    function loop() public {
        // for loop
        for (uint i = 0; i < 10; i++) {
            if (i == 3) {
                // Skip to next iteration with continue
                continue;
            }
            if (i == 5) {
                // Exit loop with break
                break;
            }
        }

        // while loop
        uint j;
        while (j < 10) {
            j++;
        }
    }
}
```

```js
function forLoopTest() public pure returns(uint256){
    uint sum = 0;
    for(uint i = 0; i < 10; i++){
      sum += i;
    }

    return(sum);
}
```

### 2-1.while:
```js
function whileTest() public pure returns(uint256){
    uint sum = 0;
    uint i = 0;

    while(i < 10){
      sum += i;
      i++;
    }

    return(sum);
}
```

### 2-2.do-while:
```js
function doWhileTest() public pure returns(uint256){
    uint sum = 0;
    uint i = 0;
    do{
      sum += i;
      i++;
    }while(i < 10);

    return(sum);
}
```

## 3.三元运算符
```js
function ternaryTest(uint256 x, uint256 y) public pure returns(uint256){
    // return the max of x and y
    return x >= y ? x: y; 
}
```

## 4.实现插入排序
排序算法解决的问题是将无序的一组数字，例如[2, 5, 3, 1]，从小到大依次排列好。

solidity中最常用的变量类型是uint，也就是正整数，取到负值的话，会报underflow错误。而在插入算法中，变量j有可能会取到-1，引起报错。

这里，我们需要把j加1，让它无法取到负值。正确代码：
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract InsertionSort {

  // 插入排序 正确版
  function insertionSort(uint[] memory a) public pure returns(uint[] memory) {
      // note that uint can not take negative value
      for (uint i = 1;i < a.length;i++){
          uint temp = a[i];
          uint j=i;
          while( (j >= 1) && (temp < a[j-1])){
              a[j] = a[j-1];
              j--;
          }
          a[j] = temp;
      }

      return(a);
  }
}
```
