## 1.Solidity支持通过构造结构体的形式定义新的类型。
您可以通过创建struct.

它们对于将相关数据分组在一起很有用。

结构可以在合约之外声明并在另一个合约中导入。

You can define your own type by creating a struct.
They are useful for grouping together related data.
Structs can be declared outside of a contract and imported in another contract.

创建结构体的方法：
```js
// 结构体
struct Student{
    uint256 id;
    uint256 score; 
}

Student student; // 初始一个student结构体
```

给结构体赋值的两种方法：
```js
//  给结构体赋值
// 方法1:在函数中创建一个storage的struct引用
function initStudent1() external{
    Student storage _student = student; // assign a copy of student
    _student.id = 11;
    _student.score = 100;
}
```

## 2.例子
```js
pragma solidity ^0.8.4;
contract StructTypes {
    // 结构体 Struct
    struct Student{
        uint256 id;
        uint256 score; 
    }
    Student student; // 初始一个student结构体
    //  给结构体赋值
    // 方法1:在函数中创建一个storage的struct引用
    function initStudent1() external{
        Student storage _student = student; // assign a copy of student
        _student.id = 11;
        _student.score = 100;
    }

    // 方法2:直接引用状态变量的struct
    function initStudent2() external{
        student.id = 1;
        student.score = 80;
    }
    
    // 方法3:构造函数式
    function initStudent3() external {
        student = Student(3, 90);
    }

    // 方法4:key value
    function initStudent4() external {
        student = Student({id: 4, score: 60});
    }
}

pragma solidity ^0.8.4;
contract EnumTypes {
    // 将uint 0， 1， 2表示为Buy, Hold, Sell
    enum ActionSet { Buy, Hold, Sell }
    // 创建enum变量 action
    ActionSet action = ActionSet.Buy;

    // enum可以和uint显式的转换
    function enumToUint() external view returns(uint){
        return uint(action);
    }
}
```

## 3.例子
07-2-struct.sol

### 3-1.声明和导入结构
声明该结构的文件
File that the struct is declared in
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// This is saved 'StructDeclaration.sol'

struct Todo {
    string text;
    bool completed;
}
```

导入上面结构的文件
File that imports the struct above
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StructDeclaration.sol";

contract Todos {
    // An array of 'Todo' structs
    Todo[] public todos;
}
```
