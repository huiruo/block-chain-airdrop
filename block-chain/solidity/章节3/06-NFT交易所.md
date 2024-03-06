Opensea是以太坊上最大的NFT交易平台，总交易总量达到了$300亿。Opensea在交易中抽成2.5%，因此它通过用户交易至少获利了$7.5亿。另外，它的运作并不去中心化，且不准备发币补偿用户。

今天我们就利用智能合约搭建一个零手续费的去中心化NFT交易所：NFTSwap。

## 设计逻辑
* 卖家：出售NFT的一方，可以挂单list、撤单revoke、修改价格update。

* 买家：购买NFT的一方，可以购买purchase。

* 订单：卖家发布的NFT链上订单，一个系列的同一tokenId最多存在一个订单，其中包含挂单价格price和持有人owner信息。当一个订单交易完成或被撤单后，其中信息清零。

## NFTSwap合约

## 1-1.事件
合约包含4个事件，对应挂单list、撤单revoke、修改价格update、购买purchase这四个行为：
```js
event List(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
event Purchase(address indexed buyer, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
event Revoke(address indexed seller, address indexed nftAddr, uint256 indexed tokenId);    
event Update(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 newPrice);
```

## 1-2.订单
NFT订单抽象为Order结构体，包含挂单价格price和持有人owner信息。nftList映射记录了订单是对应的NFT系列（合约地址）和tokenId信息。
```js
// 定义order结构体
struct Order{
    address owner;
    uint256 price; 
}

// NFT Order映射
mapping(address => mapping(uint256 => Order)) public nftList;
```

## 回退函数
在NFTSwap中，用户使用ETH购买NFT。因此，合约需要实现fallback()函数来接收ETH。
```js
fallback() external payable{}
```

## onERC721Received
ERC721的安全转账函数会检查接收合约是否实现了onERC721Received()函数，并返回正确的选择器selector。

用户下单之后，需要将NFT发送给NFTSwap合约。因此NFTSwap继承IERC721Receiver接口，并实现onERC721Received()函数：
```js
contract NFTSwap is IERC721Receiver{

// 实现{IERC721Receiver}的onERC721Received，能够接收ERC721代币
function onERC721Received(
    address operator,
    address from,
    uint tokenId,
    bytes calldata data
) external override returns (bytes4){
    return IERC721Receiver.onERC721Received.selector;
}
```

## 交易
合约实现了4个交易相关的函数：
* 挂单list()：卖家创建NFT并创建订单，并释放List事件。参数为NFT合约地址_nftAddr，NFT对应的_tokenId，挂单价格_price（注意：单位是wei）。成功后，NFT会从卖家转到NFTSwap合约中。
```js
// 挂单: 卖家上架NFT，合约地址为_nftAddr，tokenId为_tokenId，价格_price为以太坊（单位是wei）
function list(address _nftAddr, uint256 _tokenId, uint256 _price) public{
    IERC721 _nft = IERC721(_nftAddr); // 声明IERC721接口合约变量
    require(_nft.getApproved(_tokenId) == address(this), "Need Approval"); // 合约得到授权
    require(_price > 0); // 价格大于0

    Order storage _order = nftList[_nftAddr][_tokenId]; //设置NF持有人和价格
    _order.owner = msg.sender;
    _order.price = _price;
    // 将NFT转账到合约
    _nft.safeTransferFrom(msg.sender, address(this), _tokenId);

    // 释放List事件
    emit List(msg.sender, _nftAddr, _tokenId, _price);
}
```

撤单revoke()：卖家撤回挂单，并释放Revoke事件。参数为NFT合约地址_nftAddr，NFT对应的_tokenId。成功后，NFT会从NFTSwap合约转回卖家。
```js
// 撤单： 卖家取消挂单
function revoke(address _nftAddr, uint256 _tokenId) public {
    Order storage _order = nftList[_nftAddr][_tokenId]; // 取得Order        
    require(_order.owner == msg.sender, "Not Owner"); // 必须由持有人发起
    // 声明IERC721接口合约变量
    IERC721 _nft = IERC721(_nftAddr);
    require(_nft.ownerOf(_tokenId) == address(this), "Invalid Order"); // NFT在合约中
    
    // 将NFT转给卖家
    _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
    delete nftList[_nftAddr][_tokenId]; // 删除order
  
    // 释放Revoke事件
    emit Revoke(msg.sender, _nftAddr, _tokenId);
}
```

修改价格update()：卖家修改NFT订单价格，并释放Update事件。参数为NFT合约地址_nftAddr，NFT对应的_tokenId，更新后的挂单价格_newPrice（注意：单位是wei）。

```js
// 调整价格: 卖家调整挂单价格
function update(address _nftAddr, uint256 _tokenId, uint256 _newPrice) public {
    require(_newPrice > 0, "Invalid Price"); // NFT价格大于0
    Order storage _order = nftList[_nftAddr][_tokenId]; // 取得Order        
    require(_order.owner == msg.sender, "Not Owner"); // 必须由持有人发起
    // 声明IERC721接口合约变量
    IERC721 _nft = IERC721(_nftAddr);
    require(_nft.ownerOf(_tokenId) == address(this), "Invalid Order"); // NFT在合约中
    
    // 调整NFT价格
    _order.price = _newPrice;
  
    // 释放Update事件
    emit Update(msg.sender, _nftAddr, _tokenId, _newPrice);
}
```

购买purchase：买家支付ETH购买挂单的NFT，并释放Purchase事件。参数为NFT合约地址_nftAddr，NFT对应的_tokenId。成功后，ETH将转给卖家，NFT将从NFTSwap合约转给买家。
```js
// 购买: 买家购买NFT，合约为_nftAddr，tokenId为_tokenId，调用函数时要附带ETH
function purchase(address _nftAddr, uint256 _tokenId) payable public {
    Order storage _order = nftList[_nftAddr][_tokenId]; // 取得Order        
    require(_order.price > 0, "Invalid Price"); // NFT价格大于0
    require(msg.value >= _order.price, "Increase price"); // 购买价格大于标价
    // 声明IERC721接口合约变量
    IERC721 _nft = IERC721(_nftAddr);
    require(_nft.ownerOf(_tokenId) == address(this), "Invalid Order"); // NFT在合约中

    // 将NFT转给买家
    _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
    // 将ETH转给卖家，多余ETH给买家退款
    payable(_order.owner).transfer(_order.price);
    payable(msg.sender).transfer(msg.value-_order.price);

    delete nftList[_nftAddr][_tokenId]; // 删除order

    // 释放Purchase事件
    emit Purchase(msg.sender, _nftAddr, _tokenId, msg.value);
}
```