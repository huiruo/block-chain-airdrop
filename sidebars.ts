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
    // 'hello-world',
    // 'readmeTest',
    '空投网站-工具',
    '安全工具',
    {
      label: '项目',
      type: 'category',
      collapsed: true,
      items: [
        '项目/Tea',
        '项目/EigenLayer',
        '项目/Blast-L2',
        '项目/Scroll-L2',
        '项目/Linea-L2',
        '项目/wen',
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
