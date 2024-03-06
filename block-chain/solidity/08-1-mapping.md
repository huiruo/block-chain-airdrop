## map
Maps are created with the syntax mapping(keyType => valueType).

The keyType can be any built-in value type, bytes, string, or any contract.

valueType can be any type including another mapping or an array.

Mappings are not iterable.

maps是使用语法创建的mapping(keyType => valueType)。

可以keyType是任何内置值类型、字节、字符串或任何约定。

valueType可以是任何类型，包括另一个映射或数组。

映射不可迭代。
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Mapping {
    // Mapping from address to uint
    mapping(address => uint) public myMap;

    function get(address _addr) public view returns (uint) {
        // Mapping always returns a value.
        // If the value was never set, it will return the default value.
        return myMap[_addr];
    }

    function set(address _addr, uint _i) public {
        // Update the value at this address
        myMap[_addr] = _i;
    }

    function remove(address _addr) public {
        // Reset the value to the default value.
        delete myMap[_addr];
    }
}

contract NestedMapping {
    // Nested mapping (mapping from address to another mapping)
    mapping(address => mapping(uint => bool)) public nested;

    function get(address _addr1, uint _i) public view returns (bool) {
        // You can get values from a nested mapping
        // even when it is not initialized
        return nested[_addr1][_i];
    }

    function set(address _addr1, uint _i, bool _boo) public {
        nested[_addr1][_i] = _boo;
    }

    function remove(address _addr1, uint _i) public {
        delete nested[_addr1][_i];
    }
}
```

## 1. 在映射中，可以通过键（Key）来查询对应的值（Value）
比如：通过一个人的id来查询他的钱包地址。

声明映射的格式为 `mapping(_KeyType => _ValueType)`:其中`_KeyType`和`_ValueType`分别是Key和Value的变量类型。

例子：
```js
mapping(uint => address) public idToAddress; // id映射到地址
mapping(address => address) public swapPair; // 币对的映射，地址到地址
```

## 2. 映射的规则
- **规则1**：映射的`_KeyType`只能选择Solidity内置的值类型，比如`uint`，`address`等，不能用自定义的结构体。而`_ValueType`可以使用自定义的类型。下面这个例子会报错，因为`_KeyType`使用了我们自定义的结构体：

- **规则2**：映射的存储位置必须是`storage`，因此可以用于合约的状态变量，函数中的`storage`变量和library函数的参数。不能用于`public`函数的参数或返回结果中，因为`mapping`记录的是一种关系 (key - value pair)。

- **规则3**：如果映射声明为`public`，那么Solidity会自动给你创建一个`getter`函数，可以通过`Key`来查询对应的`Value`。

- **规则4**：给映射新增的键值对的语法为`_Var[_Key] = _Value`，其中`_Var`是映射变量名，`_Key`和`_Value`对应新增的键值对。

### 2-1.例子：
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract Mapping {
    mapping(uint => address) public idToAddress; // id映射到地址
    mapping(address => address) public swapPair; // 币对的映射，地址到地址
    
    // 规则1. _KeyType不能是自定义的 下面这个例子会报错
    // 我们定义一个结构体 Struct
    // struct Student{
    //    uint256 id;
    //    uint256 score; 
    //}
    // mapping(Struct => uint) public testVar;

    function writeMap (uint _Key, address _Value) public{
        idToAddress[_Key] = _Value;
    }
}
```

## 3.映射的原理
* 原理1: 映射不储存任何键（Key）的资讯，也没有length的资讯。
* 原理2: 映射使用keccak256(key)当成offset存取value。
* 原理3: 因为Ethereum会定义所有未使用的空间为0，所以未赋值（Value）的键（Key）初始值都是各个type的默认值，如uint的默认值是0。



