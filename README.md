# 重启之日 (1-Day Life Reboot)

这是一个基于 Dan Koe 的文章 [How to fix your entire life in 1 day](https://letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1) 制作的交互式网页应用。它可以帮助你用一天的时间，通过深度的心理挖掘和目标设定，彻底重启你的人生。

## 核心功能

- 🌅 **早晨挖掘**：直面隐痛，构建反向愿景，确立新的身份认同。
- ☀️ **白天观察**：提供一键生成 `.ics` 日历提醒功能，在一天中定时推送“灵魂拷问”。
- 🌙 **夜晚总结**：设定 1年目标、1个月项目和每日行动。
- 🎮 **玩家面板**：将你的所有输入生成一张极具游戏感的“角色卡片”，支持保存为图片或 PDF。
- 📖 **中文翻译**：内置了 Dan Koe 原文的完整高质量中文翻译。

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Lucide React (图标)
- dom-to-image-more (图片导出)

## 本地开发

你可以通过 `make` 命令快速执行常用操作。在终端输入 `make` 或 `make help` 可以查看所有可用命令。

```bash
# 安装依赖
make install

# 启动开发服务器
make dev

# 构建生产版本
make build
```

## Docker 部署

本项目支持使用 Docker 进行快速部署，内置了多阶段构建和 Nginx 配置。同样可以通过 `make` 命令快速操作：

### 构建并运行

```bash
# 一键构建镜像并启动容器
make docker-build
make docker-run
```

运行后，即可通过浏览器访问 `http://localhost:8080` 体验应用。

### 其他 Docker 命令

```bash
# 停止并删除容器
make docker-stop

# 彻底清理容器和镜像
make docker-clean

# 一键重新构建并运行
make docker-rebuild
```
