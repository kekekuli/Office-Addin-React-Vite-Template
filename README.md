# 开始使用
#### 此插件只在**node 22.12.0**上测试过，推荐使用一致的node主版本。运行环境推荐是管理员权限。

### 0.安装必要依赖
**如无特别说明，给出的命令都是在根目录下运行**

安装客户端依赖。  
```
npm install
```  
安装服务器依赖。
```
cd packages/server
npm install
```

### 1.运行插件
packages/server是一个独立的简易服务器，能够将消息记录存储到本地。即使插件不启动server，也能使用全部功能，但关闭会话后就会丢失消息记录。

#### 1.0 启动消息服务器（如果需要本地缓存历史记录的话）

```
cd packages/server
npm run dev
```

#### 1.1 启动插件

回到根目录下运行

```
npm run dev
```
这会启动一个vite开发服务器，然后再打开一个终端运行
```
npm run start
```

最后就会自动打开一个加载了插件的excel文档。

### 2.插件使用

如果打开的是一个空白文档或者没有 **Excel Table** 存在的文档，那么插件就会拒绝交互并提示错误信息，请确认你打开了一个有着**Excel Table**的文档。[关于Excel Table介绍。](https://support.microsoft.com/en-us/office/overview-of-excel-tables-7ab0bb7d-3a9e-4b56-a3c9-6c94334e492c)  

随后你就可以随意输入命令，插件会给出回应。如果回应是一个Table或者Scatter，那么可以点击旁边的Apply按钮应用操作到文档。

**注意** 每次点击Apply时，都会使用消息中的数据强制替换掉Excel中的数据，会丢失手动修改过的数据。

你可以随意的排列组合点击聊天室里的Apply按钮，插件只跟踪他通过点击Apply按钮做出的修改，如果你手动修改Excel中的数据，将会导致未定义行为。

### 问题追踪

如果在运行命令时，遇到需要安装证书，点击确认即可。`npm run start`命令有可能会由于不是管理员而启动失败，确认你的终端有管理员权限。   
如果插件会话关闭，在excel的**开始**选项卡下找到**Show Taskpane**即可重新打开。

## 代码实现

主要使用React + Mui + tailwind css + typescript。

#### 布局
聊天室布局分上中下，上下部分占据固定的矩形，中间部分用flex容器实现自动空间增长，滚动。  
聊天室的气泡是用flex布局 + svg + 阴影实现的。
#### 主要组件
**App** 主容器，主要管理状态和使用useEffect的组件。  
**ChatBubble** 手动实现的一个聊天气泡，只要提供**Message**类型数据就能渲染出一条信息。  
**MessageList** 聊天气泡们的容器，给聊天气泡提供需要的Message数据  
**ExcelTable** 用来渲染表格和散点图的，要求提供一个ExcelTableData参数，内部是调用了AG-Grid的组件库来渲染。  
**ContextProvider** 只是作为容器和一个上下文提供者
#### 主要类型
**ExcelTableData** 是一个Excel Table的抽象类型表示，包含一个Excel Table的 headers, rows, name。  
**Message** 包含了所有渲染一个聊天气泡的数据，只要给出一个Message实例，那么就不用依赖别的就能渲染一个聊天气泡。Message实例有可能会持有一个ExcelTableData，聊天气泡能够解析ExcelTableData从而渲染表格或者散点图。
#### 状态管理
主要的状态就是一个包含所有消息的messages，和一个ExcelTableData代表进行操作的Excel Table对象，由App组件管理并分发给子组件。  
也使用了useContext的上下文去传递嵌套太深的状态量。
#### utils文件夹下
**NetUtils.ts** 负责和服务器交互  
**ExcelParser.ts** 负责和Excel交互  
**MessageParser.ts** 负责解析用户输入的消息并给出回复

#### 其他 
消息提示是用ract-toasity库，时间库是用luxon，网络连接用axios，服务器用express + sqlite + 一些中间件，开发服务器用vite