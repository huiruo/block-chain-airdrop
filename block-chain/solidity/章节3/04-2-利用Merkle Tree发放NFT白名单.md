## 我们介绍如何利用MerkleTree合约来发放NFT白名单：
我们介绍Merkle Tree的概念，如何生成简单的Merkle Tree，如何利用智能合约验证Merkle Tree，以及用它来发放NFT白名单。

在实际使用中，复杂的Merkle Tree可以利用javascript库merkletreejs来生成和管理，链上只需要存储一个根值，非常节省gas。很多项目方都选择利用Merkle Tree来发放白名单。


一份拥有800个地址的白名单，更新一次所需的gas fee很容易超过1个ETH。

而由于Merkle Tree验证时，leaf和proof可以存在后端，链上仅需存储一个root的值，非常节省gas，项目方经常用它来发放白名单。很多ERC721标准的NFT和ERC20标准代币的白名单/空投都是利用Merkle Tree发出的，比如optimism的空投。

MerkleTree合约继承了ERC721标准，并利用了MerkleProof库。
```js
contract MerkleTree is ERC721 {
    bytes32 immutable public root; // Merkle树的根
    mapping(address => bool) public mintedAddress;   // 记录已经mint的地址

    // 构造函数，初始化NFT合集的名称、代号、Merkle树的根
    constructor(string memory name, string memory symbol, bytes32 merkleroot)
    ERC721(name, symbol)
    {
        root = merkleroot;
    }

    // 利用Merkle树验证地址并完成mint
    function mint(address account, uint256 tokenId, bytes32[] calldata proof)
    external
    {
        require(_verify(_leaf(account), proof), "Invalid merkle proof"); // Merkle检验通过
        require(!mintedAddress[account], "Already minted!"); // 地址没有mint过
        _mint(account, tokenId); // mint
        mintedAddress[account] = true; // 记录mint过的地址
    }

    // 计算Merkle树叶子的哈希值
    function _leaf(address account)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(account));
    }

    // Merkle树验证，调用MerkleProof库的verify()函数
    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}
```

## 2.状态变量
合约中共有两个状态变量：
* root存储了Merkle Tree的根，部署合约的时候赋值。
* mintedAddress是一个mapping，记录了已经mint过的地址，某地址mint成功后进行赋值。

## 3.函数
合约中共有4个函数：
* 构造函数：初始化NFT的名称和代号，还有Merkle Tree的root。
* mint()函数：利用白名单铸造NFT。参数为白名单地址account，铸造的tokenId，和proof。首先验证address是否在白名单中，验证通过则把序号为tokenId的NFT铸造给该地址，并将它记录到mintedAddress。此过程中调用了_leaf()和_verify()函数。
* _leaf()函数：计算了Merkle Tree的叶子地址的哈希。
* _verify()函数：调用了MerkleProof库的verify()函数，进行Merkle Tree验证。


## 4.remix验证
我们使用上面例子的4个地址作为白名单并生成Merkle Tree。我们部署MerkleTree合约，3个参数分别为：
```js
name = "WTF MerkleTree"
symbol = "WTF"
merkleroot = 0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097
```

### 4-2.接下来运行mint函数给地址0铸造NFT，3个参数分别为：
```js
account = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
tokenId = 0
proof = [   "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",   "0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c" ]
```

我们可以用ownerOf函数验证tokenId为0的NFT已经铸造给了地址0，合约运行成功！


如果再次调用，此时，若再次调用mint函数，虽然该地址能够通过Merkle Proof验证，但由于地址已经记录在mintedAddress中，因此该交易会由于"Already minted!"被中止。
