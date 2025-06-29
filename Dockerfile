# --- 构建阶段 (Builder Stage) ---
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖描述文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖（包括构建时需要的 devDependencies）
# 使用淘宝镜像加速
RUN pnpm install --registry=https://registry.npmmirror.com

# 复制所有项目源代码
COPY . .

# 执行构建
RUN pnpm run build

# --- 生产阶段 (Production Stage) ---
FROM node:18-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 从构建阶段复制编译后的代码和依赖描述文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/bootstrap.js ./bootstrap.js

# 只安装生产环境依赖，这会大大减小镜像体积
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 暴露应用端口 (请确保与您配置的端口一致)
EXPOSE 7001

# 定义容器启动命令
CMD ["pnpm", "run", "start"]