## interface
You can interact with other contracts by declaring an Interface.
* cannot have any functions implemented
* can inherit from other interfaces
* all declared functions must be external
* cannot declare a constructor
* cannot declare state variables

您可以通过声明Interface.
* 无法实现任何功能
* 可以继承其他接口
* 所有声明的函数必须是外部的
* 无法声明构造函数
* 无法声明状态变量
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint public count;

    function increment() external {
        count += 1;
    }
}

interface ICounter {
    function count() external view returns (uint);

    function increment() external;
}

contract MyContract {
    function incrementCounter(address _counter) external {
        ICounter(_counter).increment();
    }

    function getCount(address _counter) external view returns (uint) {
        return ICounter(_counter).count();
    }
}

// Uniswap example
interface UniswapV2Factory {
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
}

interface UniswapV2Pair {
    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

contract UniswapExample {
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function getTokenReserves() external view returns (uint, uint) {
        address pair = UniswapV2Factory(factory).getPair(dai, weth);
        (uint reserve0, uint reserve1, ) = UniswapV2Pair(pair).getReserves();
        return (reserve0, reserve1);
    }
}
```

## 抽象合约
用ERC721的接口合约为例介绍solidity中的抽象合约（abstract）和接口（interface）,帮助大家更好的理解ERC721标准。

如果一个智能合约里至少有一个未实现的函数，即某个函数缺少主体{}中的内容，则必须将该合约标为abstract，不然编译会报错；另外，未实现的函数需要加virtual，以便子合约重写。拿我们之前的插入排序合约为例，如果我们还没想好具体怎么实现插入排序函数，那么可以把合约标为abstract，之后让别人补写上。
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

abstract contract InsertionSort{
    function insertionSort(uint[] memory a) public pure virtual returns(uint[] memory);
}
```

## 接口
接口类似于抽象合约，但它不实现任何功能。接口的规则：
1. 不能包含状态变量
2. 不能包含构造函数
3. 不能继承除接口外的其他合约
4. 所有函数都必须是external且不能有函数体
5. 继承接口的合约必须实现接口定义的所有功能

虽然接口不实现任何功能，但它非常重要。接口是智能合约的骨架，定义了合约的功能以及如何触发它们：如果智能合约实现了某种接口（比如ERC20或ERC721），其他Dapps和智能合约就知道如何与它交互。因为接口提供了两个重要的信息：
1. 合约里每个函数的bytes4选择器，以及函数签名函数名(每个参数类型）。
2. 接口id

另外，接口与合约ABI（Application Binary Interface）等价，可以相互转换：编译接口可以得到合约的ABI，利用abi-to-sol工具也可以将ABI json文件转换为接口sol文件。

我们以ERC721接口合约IERC721为例，它定义了3个event和9个function，所有ERC721标准的NFT都实现了这些函数。我们可以看到，接口和常规合约的区别在于每个函数都以;代替函数体{ }结尾。
```js
interface IERC721 is IERC165 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function transferFrom(address from, address to, uint256 tokenId) external;

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(address owner, address operator) external view returns (bool);

    function safeTransferFrom( address from, address to, uint256 tokenId, bytes calldata data) external;
}
```

## IERC721事件
IERC721包含3个事件，其中Transfer和Approval事件在ERC20中也有。
* Transfer事件：在转账时被释放，记录代币的发出地址from，接收地址to和tokenid。
* Approval事件：在授权时释放，记录授权地址owner，被授权地址approved和tokenid。
* ApprovalForAll事件：在批量授权时释放，记录批量授权的发出地址owner，被授权地址operator和授权与否的approved。

## IERC721函数
* balanceOf：返回某地址的NFT持有量balance。
* ownerOf：返回某tokenId的主人owner。
* transferFrom：普通转账，参数为转出地址from，接收地址to和tokenId。
* safeTransferFrom：安全转账（如果接收方是合约地址，会要求实现ERC721Receiver接口）。参数为转出地址from，接收地址to和tokenId。
* approve：授权另一个地址使用你的NFT。参数为被授权地址approve和tokenId。
* getApproved：查询tokenId被批准给了哪个地址。
* setApprovalForAll：将自己持有的该系列NFT批量授权给某个地址operator。
* isApprovedForAll：查询某地址的NFT是否批量授权给了另一个operator地址。
* safeTransferFrom：安全转账的重载函数，参数里面包含了data。

## 什么时候使用接口？
如果我们知道一个合约实现了IERC721接口，我们不需要知道它具体代码实现，就可以与它交互。

无聊猿BAYC属于ERC721代币，实现了IERC721接口的功能。我们不需要知道它的源代码，只需知道它的合约地址，用IERC721接口就可以与它交互，比如用balanceOf()来查询某个地址的BAYC余额，用safeTransferFrom()来转账BAYC。
```js
contract interactBAYC {
    // 利用BAYC地址创建接口合约变量（ETH主网）
    IERC721 BAYC = IERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);

    // 通过接口调用BAYC的balanceOf()查询持仓量
    function balanceOfBAYC(address owner) external view returns (uint256 balance){
        return BAYC.balanceOf(owner);
    }

    // 通过接口调用BAYC的safeTransferFrom()安全转账
    function safeTransferFromBAYC(address from, address to, uint256 tokenId) external{
        BAYC.safeTransferFrom(from, to, tokenId);
    }
}
```
