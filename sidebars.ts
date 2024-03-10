import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
  docs: [
    'start',
    {
      label: 'trader',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: 'analyze',
          type: 'category',
          collapsed: true,
          items: [
            'trader/analyze/成交量-FTM',
          ]
        },
        {
          label: '日本蜡烛图技术',
          type: 'category',
          collapsed: true,
          items: [
            'trader/日本蜡烛图技术/节选1',
            'trader/日本蜡烛图技术/反转形态',
            'trader/日本蜡烛图技术/十字线',
            'trader/日本蜡烛图技术/纺锤线',
            'trader/日本蜡烛图技术/伞形线之锤子线',
            'trader/日本蜡烛图技术/伞形线之上吊线',
            'trader/日本蜡烛图技术/吞没形态',
            'trader/日本蜡烛图技术/乌云盖顶',
            'trader/日本蜡烛图技术/刺透形态',
            'trader/日本蜡烛图技术/星线',
          ]
        },
        {
          label: 'learn',
          type: 'category',
          collapsed: true,
          items: [
            'trader/learn/书籍',
          ]
        },
        'trader/止损',
        'trader/豪哥交易经验',
        // 'trader/交易网站',
        'trader/成交量分析-0302',
        'trader/op-long-0303',
        'trader/strk-long-0303',
        'trader/上涨趋势',
        'trader/strk2',
        'trader/strk2',
        'trader/RNDR卖飞',
        'trader/pixel-卖飞-观察量价',
      ]
    },
    {
      label: '开发',
      type: 'category',
      collapsed: true,
      items: [
        'develop/readme',
        'develop/运行template-ethereum-contracts',
        'develop/hardhat',
        'develop/web3modal/web3modal',
        'develop/wagmi/wagmi',
        'develop/openzeppelin/openzeppelin',
      ]
    },
    {
      label: 'solidity',
      type: 'category',
      collapsed: true,
      items: [
        'solidity/readme',
        'solidity/变量类型-初始值',
        'solidity/变量数据存储和作用域',
        'solidity/三种类型变量-常量-读取写入状态变量',
        'solidity/constant和immutable',
        'solidity/array',
        'solidity/enum',
        'solidity/mapping',
        'solidity/function-variable-能见度',
        'solidity/function',
        'solidity/function return',
        'solidity/function Selector',
        'solidity/函数重载',
        'solidity/for-if-插入排序',
        'solidity/constructor-修饰器modifier',
        'solidity/inheritance',
        'solidity/struct',
        'solidity/抽象合约和interface',
        'solidity/Calling Other Contract',
        'solidity/fallback',
        'solidity/call',
        'solidity/Payable',
        'solidity/异常',
        'solidity/事件',
        'solidity/new创建其他合约的合约',
        'solidity/Ether and Wei',
        'solidity/发送以太币',
        {
          label: '章节2',
          type: 'category',
          collapsed: true,
          items: [
            'solidity/章节2/01-1-Library',
            'solidity/章节2/02-1-Import',
            'solidity/章节2/03-1-接收-receive和fallback',
            'solidity/章节2/04-1-发送ETH',
            'solidity/章节2/05-1-调用已部署的合约',
            'solidity/章节2/06-1-Call',
            'solidity/章节2/07-1-Delegatecall',
            'solidity/章节2/08-1-在合约中创建新合约',
            'solidity/章节2/09-1-Create2',
            'solidity/章节2/10-1-删除合约',
            'solidity/章节2/11-1-ABI编码-Encode',
            'solidity/章节2/11-2-ABI解码-decode',
            'solidity/章节2/Gas Saving',
            'solidity/章节2/Hash-使用Keccak256进行哈希处理',
            'solidity/章节2/selector',
          ]
        },
        {
          label: '章节3',
          type: 'category',
          collapsed: true,
          items: [
            'solidity/章节3/01-1-ERC20',
            'solidity/章节3/04-1-默克尔树MerkleTree',
            'solidity/章节3/04-2-利用Merkle Tree发放NFT白名单',
            'solidity/章节3/05-1-数字签名 Signature',
            'solidity/章节3/11-1-线性释放',
            'solidity/章节3/14-1-时间锁',
            'solidity/章节3/15-1-代理合约',
            'solidity/章节3/16-1-可升级合约',
            'solidity/章节3/17-1-透明代理',
            'solidity/章节3/Airdrop',
            'solidity/章节3/ERC1155',
            'solidity/章节3/ERC721/04-1-ERC721',
            'solidity/章节3/ERC721/04-2-写一个免费铸造的APE',
            'solidity/章节3/ERC721/readme',
            'solidity/章节3/NFT交易所',
            'solidity/章节3/WETH',
            'solidity/章节3/代币水龙头',
            'solidity/章节3/代币锁',
            'solidity/章节3/分账',
            'solidity/章节3/多签钱包',
            'solidity/章节3/链上随机数生成',
          ]
        },
        {
          label: 'Applications',
          type: 'category',
          collapsed: true,
          items: [
            'solidity/Applications/05-1-ERC20',
            'solidity/Applications/05-2-Create_ERC20_token',
            'solidity/Applications/ERC721',
            'solidity/Applications/Iterable Mapping',
            'solidity/Applications/Merkle Tree',
            'solidity/Applications/Multi Delegatecall',
            'solidity/Applications/MultiCall',
            'solidity/Applications/Time Lock',
            'solidity/Applications/以太坊钱包',
            'solidity/Applications/众筹',
            'solidity/Applications/使用Create2预先计算合约地址',
            'solidity/Applications/写入任意插槽',
            'solidity/Applications/单向支付通道',
            'solidity/Applications/双向支付通道',
            'solidity/Applications/多重签名钱包',
            'solidity/Applications/无Gas代币转移',
            'solidity/Applications/最小代理合同',
            'solidity/Applications/汇编二进制求幂',
            'solidity/Applications/英国拍卖',
            'solidity/Applications/荷兰式拍卖',
            'solidity/Applications/部署任何合约',
          ]
        },
        {
          label: 'Hacks',
          type: 'category',
          collapsed: true,
          items: [
            'solidity/Hacks/Arithmetic Overflow and Underflow',
            'solidity/Hacks/Denial of Service',
            'solidity/Hacks/Front Running',
            'solidity/Hacks/Honeypot',
            'solidity/Hacks/Phishing with tx.origin',
            'solidity/Hacks/Signature Replay',
            'solidity/Hacks/selfdestruct',
            'solidity/Hacks/区块时间戳操作',
            'solidity/Hacks/同一地址部署不同合约',
            'solidity/Hacks/委托调用',
            'solidity/Hacks/绕过合约规模检查',
            'solidity/Hacks/访问私人数据',
            'solidity/Hacks/重新进入',
            'solidity/Hacks/金库通货膨胀',
            'solidity/Hacks/随机性的来源',
          ]
        },
        {
          label: 'DeFi-去中心化金融',
          type: 'category',
          collapsed: true,
          items: [
            'solidity/DeFi-去中心化金融/02-2-Uniswap V2 最优单侧供应',
            'solidity/DeFi-去中心化金融/Chainlink 价格预言机',
            'solidity/DeFi-去中心化金融/DAI Proxy Examples',
            'solidity/DeFi-去中心化金融/Discrete Staking Rewards',
            'solidity/DeFi-去中心化金融/Uniswap V2 Swap',
            'solidity/DeFi-去中心化金融/Uniswap V2 添加删除流动性',
            'solidity/DeFi-去中心化金融/Uniswap V2 闪存交换',
            'solidity/DeFi-去中心化金融/Uniswap V3 Liquidity',
            'solidity/DeFi-去中心化金融/Uniswap V3 交换示例',
            'solidity/DeFi-去中心化金融/Uniswap V3 闪电掉期套利',
            'solidity/DeFi-去中心化金融/Uniswap V3 闪贷',
            'solidity/DeFi-去中心化金融/Vault',
            'solidity/DeFi-去中心化金融/质押奖励',
          ]
        },
      ]
    },
    '链上监控',
    '安全工具',
    '区块链资讯',
    '空投网站-工具',
    {
      label: 'airdop',
      type: 'category',
      collapsed: true,
      items: [
        'airdop/15-2024空投',
        'airdop/Berachain',
        'airdop/Tea',
        'airdop/EigenLayer',
        'airdop/Blast-L2',
        'airdop/Scroll-L2',
        'airdop/Linea-L2',
        'airdop/wen',
      ]
    },
    {
      label: '知识',
      type: 'category',
      collapsed: true,
      items: [
        '知识/深度休息反而加速学习',
        '知识/术语',
        '知识/btc-etf',
        '知识/成功经验1',
        '知识/思维-越是没有成本的越占用你的时间',
      ]
    },
  ]
};

export default sidebars;
