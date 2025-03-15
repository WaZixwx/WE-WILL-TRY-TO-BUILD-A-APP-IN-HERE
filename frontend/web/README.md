# LightLink For Web前端应用

LightLink For Web是一个现代化的Vue3应用，采用最新的前端技术栈构建。

## 项目结构

```
frontend/web/
├── src/                    # 源代码目录
│   ├── api/                # API请求模块
│   ├── assets/             # 静态资源
│   ├── components/         # 公共组件
│   │   └── common/         # UI组件库
│   ├── router/             # 路由配置
│   ├── store/              # Pinia状态管理
│   │   └── modules/        # 状态模块
│   ├── styles/             # 全局样式
│   ├── types/              # TypeScript类型声明
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── public/                 # 公共静态资源
├── .gitignore              # Git忽略配置
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite配置
└── README.md               # 项目说明
```

## 技术栈

- **框架**：Vue 3
- **语言**：TypeScript
- **状态管理**：Pinia
- **路由**：Vue Router
- **构建工具**：Vite
- **HTTP请求**：Axios
- **代码规范**：ESLint

## UI组件库

LightLink包含了一套自研的UI组件库，位于`src/components/common/`目录：

- **Alert**: 警告提示组件
- **Avatar**: 头像组件
- **Badge**: 徽章组件
- **Button**: 按钮组件
- **Card**: 卡片组件
- **Dropdown**: 下拉菜单组件
- **Form/FormItem**: 表单组件
- **Input**: 输入框组件
- **Modal**: 模态框组件
- **Progress**: 进度条组件
- **Tabs**: 标签页组件

## 开发指南

### 环境准备

确保安装了Node.js 16.0.0或更高版本。

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目规范

- 组件名称使用PascalCase命名
- 使用TypeScript类型声明
- 遵循Vue 3组合式API风格
- 使用ESM模块系统
- 样式采用Scoped CSS确保组件样式隔离

## 作者

- **WaZixwx**
- **HanBai**

## 版权信息

Copyright © 2023 LightLink团队. 保留所有权利。