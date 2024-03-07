## 1.array
数组分为固定长度数组和可变长度数组两种<br/> Array can have a compile-time fixed size or a dynamic size.

### 1-1.固定长度数组：在声明时指定数组的长度
用`T[k]`的格式声明，其中T是元素的类型，k是长度，例如：
```js
// 固定长度 Array
uint[8] array1;
bytes1[5] array2;
address[100] array3;
```

### 1-2.动态数组
在声明时不指定数组的长度。用`T[]`的格式声明，其中T是元素的类型
```js
// 可变长度 Array
uint[] array4;
bytes1[] array5;
address[] array6;
bytes array7;
```
> bytes比较特殊，是数组，但是不用加[]。
> 另外，不能用byte[]声明单字节数组，可以使用bytes或bytes1[]。
> 在gas上，bytes比bytes1[]便宜。因为bytes1[]在memory中要增加31个字节进行填充，会产生额外的gas。但是在storage中，由于内存紧密打包，不存在字节填充。

### 1-3.例子
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Array {
    // Several ways to initialize an array
    uint[] public arr;
    uint[] public arr2 = [1, 2, 3];
    // Fixed sized array, all elements initialize to 0
    uint[10] public myFixedSizeArr;

    function get(uint i) public view returns (uint) {
        return arr[i];
    }

    // Solidity can return the entire array.
    // But this function should be avoided for
    // arrays that can grow indefinitely in length.
    function getArr() public view returns (uint[] memory) {
        return arr;
    }

    function push(uint i) public {
        // Append to array
        // This will increase the array length by 1.
        arr.push(i);
    }

    function pop() public {
        // Remove last element from array
        // This will decrease the array length by 1
        arr.pop();
    }

    function getLength() public view returns (uint) {
        return arr.length;
    }

    function remove(uint index) public {
        // Delete does not change the array length.
        // It resets the value at index to it's default value,
        // in this case 0
        delete arr[index];
    }

    function examples() external {
        // create array in memory, only fixed size can be created
        uint[] memory a = new uint[](5);
    }
}
```

## 02.创建数组的规则
* 对于memory修饰的动态数组，可以用new操作符来创建，但是必须声明长度，并且声明后长度不能改变。
```js
// memory动态数组
uint[] memory array8 = new uint[](5);
bytes memory array9 = new bytes(9);
```

* 数组字面常量(Array Literals)是写作表达式形式的数组，用方括号包着来初始化array的一种方式，并且里面每一个元素的type是以第一个元素为准的，例如[1,2,3]里面所有的元素都是uint8类型，因为在solidity中如果一个值没有指定type的话，默认就是最小单位的该type，这里int的默认最小单位类型就是uint8。而[uint(1),2,3]里面的元素都是uint类型，因为第一个元素指定了是uint类型了，我们都以第一个元素为准。 下面的合约中，对于f函数里面的调用，如果我们没有显式对第一个元素进行uint强转的话，是会报错的，因为如上所述我们其实是传入了uint8类型的array，可是g函数需要的却是uint类型的array，就会报错了。
* 如果创建的是动态数组，你需要一个一个元素的赋值。
```js
uint[] memory x = new uint[](3);
x[0] = 1;
x[1] = 3;
x[2] = 4;
```

## 03.数组成员
* length: 数组有一个包含元素数量的length成员，memory数组的长度在创建后是固定的。
* push(): 动态数组和bytes拥有push()成员，可以在数组最后添加一个0元素。
* push(x): 动态数组和bytes拥有push(x)成员，可以在数组最后添加一个x元素。
* pop(): 动态数组和bytes拥有pop()成员，可以移除数组最后一个元素。

## 04.例子
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract ArrayTypes {

    // 固定长度 Array
    uint[8] array1;
    bytes1[5] array2;
    address[100] array3;

    // 可变长度 Array
    uint[] array4;
    bytes1[] array5;
    address[] array6;
    bytes array7;

    // 初始化可变长度 Array
    uint[] array8 = new uint[](5);
    bytes array9 = new bytes(9);
    //  给可变长度数组赋值
    function initArray() external pure returns(uint[] memory){
        uint[] memory x = new uint[](3);
        x[0] = 1;
        x[1] = 3;
        x[2] = 4;
        return(x);
    }  
    function arrayPush() public returns(uint[] memory){
        uint[2] memory a = [uint(1),2];
        array4 = a;
        array4.push(3);
        return array4;
    }
}
```

## 05-删除数组元素的示例
Examples of removing array element

### 05-1.通过从右向左移动元素来删除数组元素
Remove array element by shifting elements from right to left
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArrayRemoveByShifting {
    // [1, 2, 3] -- remove(1) --> [1, 3, 3] --> [1, 3]
    // [1, 2, 3, 4, 5, 6] -- remove(2) --> [1, 2, 4, 5, 6, 6] --> [1, 2, 4, 5, 6]
    // [1, 2, 3, 4, 5, 6] -- remove(0) --> [2, 3, 4, 5, 6, 6] --> [2, 3, 4, 5, 6]
    // [1] -- remove(0) --> [1] --> []

    uint[] public arr;

    function remove(uint _index) public {
        require(_index < arr.length, "index out of bound");

        for (uint i = _index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }

    function test() external {
        arr = [1, 2, 3, 4, 5];
        remove(2);
        // [1, 2, 4, 5]
        assert(arr[0] == 1);
        assert(arr[1] == 2);
        assert(arr[2] == 4);
        assert(arr[3] == 5);
        assert(arr.length == 4);

        arr = [1];
        remove(0);
        // []
        assert(arr.length == 0);
    }
}
```

### 05-2.通过将最后一个元素复制到要删除的位置来删除数组元素
Remove array element by copying last element into to the place to remove
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArrayReplaceFromEnd {
    uint[] public arr;

    // Deleting an element creates a gap in the array.
    // One trick to keep the array compact is to
    // move the last element into the place to delete.
    function remove(uint index) public {
        // Move the last element into the place to delete
        arr[index] = arr[arr.length - 1];
        // Remove the last element
        arr.pop();
    }

    function test() public {
        arr = [1, 2, 3, 4];

        remove(1);
        // [1, 4, 3]
        assert(arr.length == 3);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
        assert(arr[2] == 3);

        remove(2);
        // [1, 4]
        assert(arr.length == 2);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
    }
}
```
