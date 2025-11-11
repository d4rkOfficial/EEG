# EEG

## 核心功能

### 1. 实时数据采集与传输
- 通过WebSerial连接EEG设备获取原始数据
- 基于WebSocket的实时数据传输
- 支持多设备同时连接

### 2. 数据处理与解析
- 使用Web Workers进行高效的数据解析
- 支持处理不同频段的脑电数据(theta、alpha、beta、gamma等)
- 提取注意力和放松度等特征指标

### 3. 数据存储与管理
- SQLite数据库存储历史记录
- 支持按测试ID组织数据
- 可导出数据用于进一步分析

### 4. 数据可视化
- 实时波形图表展示
- 多通道数据同时监控
- 直观的用户界面

### 5. 多角色支持
- 测试者(Tester)：负责连接设备和监控数据
- 被测试者(Testee)：佩戴脑电设备，参与测试过程，扫描二维码同步查看自己的专注度/放松度

## 快速开始

### 前提条件
- 安装 [Deno](https://deno.land/)

### 运行步骤

在项目根目录下执行以下命令：

#### 安装依赖
```bash
# 安装前端依赖
cd frontend
deno install
cd ..

# 安装后端依赖
cd backend
deno install
cd ..
```

#### 开发与打包
在Windows系统 + Visual Studio Code中，打开工作区`EEG.code-workspace`，安装推荐的依赖后，查看底部状态栏。可以看到两个按钮，分别是 **`打包`** 和 **`开发`**。

点击 **`开发`** 按钮，即可启动前端和后端的开发服务和预览窗口（使用msedge.exe）。

点击 **`打包`** 按钮，即可打包前端和后端的代码（环境: Windows + Microsoft Edge）。

> 可以查看`tasks/dev.ps1`，`tasks/build.ps1`了解如何在其它操作系统中自定义打包和开发脚本。或把启动app的浏览器从 Edge 切换成 Chrome 等其它支持 WebSerial API 的浏览器。

#### 打包过程及打包结果
前端和后端的服务代码，以及您安装的`deno.exe`将被打包到`out/archive.zip`，除此之外还有一个启动脚本`start.bat`将被打包。

解压后，在Windows操作系统下，直接运行`start.bat`即可开启服务进程和测试工作人员app。请允许相关网络权限。
