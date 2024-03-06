import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
    '空投网站-工具',
    '安全工具',
    '区块链资讯',
    '项目/15-2024空投',
    '术语',
    {
      label: '项目',
      type: 'category',
      collapsed: true,
      items: [
        '项目/Berachain',
        '项目/Tea',
        '项目/EigenLayer',
        '项目/Blast-L2',
        '项目/Scroll-L2',
        '项目/Linea-L2',
        '项目/wen',
      ]
    },
    {
      label: 'trader',
      type: 'category',
      collapsed: true,
      items: [
        'trader/止损',
        // 'trader/交易网站',
        'trader/成交量分析-0302',
        'trader/op-long-0303',
        'trader/strk-long-0303',
        'trader/上涨趋势',
        'trader/strk2',
      ]
    },
    {
      label: '知识',
      type: 'category',
      collapsed: true,
      items: [
        '知识/成功经验1',
        '知识/思维-越是没有成本的越占用你的时间'
      ]
    },
  ]
};

export default sidebars;
