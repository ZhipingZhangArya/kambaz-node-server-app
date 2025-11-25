# 如何将模块同步到 MongoDB Atlas

## 问题
本地数据库有模块数据，但远程 MongoDB Atlas 数据库可能没有。需要将模块嵌入到远程数据库的课程中。

## 解决方案

### 方法 1: 使用环境变量（推荐）

1. 在 `kambaz-node-server-app` 目录下，临时设置 `DATABASE_CONNECTION_STRING` 环境变量指向远程 MongoDB Atlas：

```bash
export DATABASE_CONNECTION_STRING="mongodb+srv://username:password@cluster.mongodb.net/kambaz?appName=Kambaz"
```

2. 运行嵌入脚本：

```bash
npm run embed-modules
```

3. 验证结果：

```bash
npm run check-modules
```

### 方法 2: 直接修改 .env 文件（临时）

1. 备份当前的 `.env` 文件
2. 临时修改 `.env` 文件中的 `DATABASE_CONNECTION_STRING` 指向远程数据库
3. 运行 `npm run embed-modules`
4. 恢复 `.env` 文件

### 方法 3: 使用 MongoDB Compass

1. 打开 MongoDB Compass
2. 连接到远程 MongoDB Atlas 数据库
3. 检查 `modules` 集合是否有数据
4. 如果有数据，可以手动运行脚本或使用 Compass 的导入功能

## 注意事项

- 确保远程数据库连接字符串正确
- 确保有写入权限
- 运行脚本前建议先备份数据

