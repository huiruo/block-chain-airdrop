## 1. 枚举 enum
enum是一个比较冷门的变量，几乎没什么人用。

枚举（enum）是solidity中用户定义的数据类型。它主要用于为uint分配名称，使程序易于阅读和维护。它与C语言中的enum类似，使用名称来代替从0开始的uint：
```js
// 用enum将uint 0， 1， 2表示为Buy, Hold, Sell
enum ActionSet { Buy, Hold, Sell }
// 创建enum变量 action
ActionSet action = ActionSet.Buy;
```

它可以显式的和uint相互转换，并会检查转换的正整数是否在枚举的长度内，不然会报错：
```js
// enum可以和uint显式的转换
function enumToUint() external view returns(uint){
    return uint(action);
}
```

## Solidity 支持枚举，它们对于建模选择和跟踪状态很有用。

枚举可以在合同之外声明。
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Enum {
    // Enum representing shipping status
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Canceled
    }

    // Default value is the first element listed in
    // definition of the type, in this case "Pending"
    Status public status;

    // Returns uint
    // Pending  - 0
    // Shipped  - 1
    // Accepted - 2
    // Rejected - 3
    // Canceled - 4
    function get() public view returns (Status) {
        return status;
    }

    // Update status by passing uint into input
    function set(Status _status) public {
        status = _status;
    }

    // You can update to a specific enum like this
    function cancel() public {
        status = Status.Canceled;
    }

    // delete resets the enum to its first value, 0
    function reset() public {
        delete status;
    }
}
```

## 声明和导入 Enum
声明枚举的文件
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// This is saved 'EnumDeclaration.sol'

enum Status {
    Pending,
    Shipped,
    Accepted,
    Rejected,
    Canceled
}
```

导入上面枚举的文件
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EnumDeclaration.sol";

contract Enum {
    Status public status;
}
```
