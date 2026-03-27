.PHONY: help install dev build preview docker-build docker-run docker-stop docker-clean clean

# 默认目标
.DEFAULT_GOAL := help

# 变量定义
APP_NAME = life-reboot-app
PORT = 8080

help: ## 显示帮助信息
	@echo "可用命令列表:"
	@echo "--------------------------------------------------------"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo "--------------------------------------------------------"

# --- 本地开发命令 ---

install: ## 安装 Node.js 依赖
	npm install

dev: ## 启动本地开发服务器 (带热更新)
	npm run dev

build: ## 构建生产环境静态文件
	npm run build

preview: build ## 在本地预览构建好的生产环境版本
	npm run preview

clean: ## 清理构建产物和依赖
	rm -rf dist
	rm -rf node_modules

# --- Docker 相关命令 ---

docker-build: ## 构建 Docker 镜像
	docker build -t $(APP_NAME) .

docker-run: ## 运行 Docker 容器 (后台运行，映射到 8080 端口)
	@echo "正在启动容器，访问地址: http://localhost:$(PORT)"
	docker run -d -p $(PORT):80 --name $(APP_NAME) $(APP_NAME)

docker-stop: ## 停止并删除 Docker 容器
	docker stop $(APP_NAME) || true
	docker rm $(APP_NAME) || true

docker-clean: docker-stop ## 停止容器并删除 Docker 镜像
	docker rmi $(APP_NAME) || true

# --- 组合命令 ---

docker-rebuild: docker-clean docker-build docker-run ## 重新构建并运行 Docker 容器