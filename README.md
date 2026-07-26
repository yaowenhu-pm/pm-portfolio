# 胡耀文 · 产品经理作品集

一份以翻页式交互呈现的个人产品经理作品集，展示产品观、经历、方法论、作品与联系方式。

在线访问：[yaowenhu-pm.github.io/yaowenhu-pm-portfolio](https://yaowenhu-pm.github.io/yaowenhu-pm-portfolio/)

## 页面内容

- 个人简介与产品观
- 项目经历与方法论
- 代表作品与联系方式

## 本地预览

无需安装依赖。在仓库根目录执行：

```bash
python3 -m http.server 4173
```

打开 <http://localhost:4173>，并检查桌面与 375px 宽度的移动端视图。

## 目录结构

```text
.
├── index.html          # 页面结构与内容
├── styles/main.css     # 全部样式与响应式规则
├── js/
│   ├── low-power.js    # 低功耗与静态显示模式
│   ├── background.js   # WebGL 双背景
│   ├── deck.js         # 翻页与输入交互
│   ├── animations.js   # 页面入场动画
│   └── main.js         # 初始化入口
└── images/             # 页面图片与二维码
```

## 部署

GitHub Pages 从 `main` 分支根目录发布。推送到 `main` 后，访问上方在线地址即可查看最新版本。
