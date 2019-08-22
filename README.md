## Docker Compose 实践

通过 Docker Compose 编排一个 Node + Mongodb + Nginx，前端采用 React 的前后端分离的服务。

## 运行

```bash
git clone https://github.com/superman66/docker-demo.git

cd docker-demo
```

分别安装前端 `docker-demo/app` 与 server `docker-demo/server`端的依赖。

安装前端依赖

```bash
cd app
npm install
// 或者
yarn
```

构建前端代码

```bash
cd app
npm run build
```

安装服务端依赖

```bash
cd server
npm install
// 或者
yarn
```

安装构建完成后，就可以用 docker-compose 启动容器运行了。

```
docker-compose up -d
```

如果一切顺利的话，打开浏览器输入 `localhost:8084`，就能看到页面了。

使用 Docker 部署就是这么简单，一个 docker-compose.yml 文件，搞定了 Nginx + Node + Mongodb 服务。

## 更多
关于 Docker 的学习

- [Dokcer — 从入门到实践](https://yeasy.gitbooks.io/docker_practice/content/)
- [Docker 学习路线图及整理](./docker学习路线.md)
