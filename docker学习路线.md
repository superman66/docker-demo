---
tags: [Docker]
title: docker学习路线
created: '2019-08-05T10:15:22.705Z'
modified: '2019-08-05T10:27:53.282Z'
---

# Docker 路线图学习整理
# Docker基础
## 1、学习 Docker 基本概念
### Docker 镜像（image）

Docker 镜像是一个特殊的文件系统，除了提供容器程序运行时所需要的程序，库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

### Dockerfile 初步概念

A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image.

Dockerfile 是一个用户可以定义命令来构建 image 的文本文档。
用于构建镜像。


### Docker 容器（Container）

容器与镜像的关系，就如同类与类实例的关系。镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停。
容器的实质是进程，但与之间在宿主执行的进程不同，容器进行运行与属于自己的独立的命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。

## 2、练习
* 安装 Dokcer：[官方安装指南](https://docs.docker.com/engine/installation/)
* 配置本地 Docker 环境
	* 配置国内镜像
### 管理容器的生命周期与配置
#### 创建、删除、检查、启动、停止容器

创建容器,使用 -d 参数会让容器进入后台运行
```
docker run name [options]
```

删除容器
```
docker container [name] rm [-f]
```

停止容器 
```
docker container stop [name]
```

启动容器
```
docker container start name
```

删除所有处于终止状态的容器
```
docker container prune
```

查看所有运行的容器, -a 表示显示所有容器（包含已终止）
```
docker ps [-a]
```

### 环境变量
环境变量可以通过创建容器时通过命令直接声明
```
docker run nginx -d --env <key>=<value>
```
也可以通过 Dockerfile ENV 来设定 

### 端口配置

Dockerfile EXPOSE 指令可以声明运行时容器提供服务端口。
格式：EXPORT <端口1> [<端口2>...]
EXPOSE 指令声明的是容器打算使用什么端口，并不会自动在宿主进行端口映射。
而 -p 则是将容器对应端口的服务公开给外界访问。

###  学习端口映射和容器链接

#### 端口映射
容器运行时可以通过 -P 或者 -p 来配置端口。
当使用 -P 标记时，Docker 会随机映射一个 49000~49900 的端口到内部容器开放的网络端口。
当使用 -p，则可以指定要映射的端口。并且，在一个指定端口上只可以绑定一个容器。支持的格式：ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort。
1、ip::containerPort 映射所有接口地址
docker run -p 5000::5000 xxx
表示将本地的5000端口映射到容器的5000端口。
2、ip:hostPort:containerPort 映射到指定地址的指定端口
docker run -p 127.0.0.1:8089:80 xxx
表示将127.0.0.1:8089 端口映射到容器的80端口。
3、ip::containerPort 映射到指定地址的任意端口
docker run -d 127.0.0.1::5000 xxx
表示将 127.0.0.1 的任意端口映射到容器的5000端口，本地主机会自动分配一个端口。

#### 容器链接
推荐使用 docker-compose

###  学习利用 volume 保存持久化容器数据

volume 数据卷是一个可供一个或者多个容器使用的特殊目录。

* volume 可以在多个容器间共享与重用。
* 对 volume 的修改会马上生效
* 容器删除后，volume 默认一直存在

**创建一个数据卷**
```
docker volume create my-demo-volume
```

**查看所有数据卷**
```
docker volume ls
```

**查看指定volume的信息**
```
docker volume inspect my-volume
[
    {
        "CreatedAt": "2018-12-24T14:02:55Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-volume/_data",
        "Name": "my-volume",
        "Options": {},
        "Scope": "local"
    }
]
```

**容器挂载数据卷**
```
docker run -d -P \
--name web \
--mount source=my-volume,target=/webapp \
supermanchen/xxx \
node index.js
```
其中 `--mount source=my-volume,target=/webapp` 表示该容器加载 `my-volume` 数据卷到容器的 `/webapp` 目录。一个容器可以挂载多个 volume


由于 volume 并不会随着容器的删除而自动删除。如果想要在删除容器的时候一起删除 volume，可以使用 `docker rm -v` 这个命令。
手动删除某个数据卷：
```
docker volume rm my-volume
```

对于那些无主的数据卷，可以使用：`docker volume prune` 进行批量删除。

### 学习检查容器日志
使用 docker logs 来获取容器日志。
```
docker logs [options] container 
```
options常用的参数有：
* —details 显示logs额外的信息
* —tail 默认是 all，显示倒数第几行


### 学习监控容器内部进程状态
#### docker top
显示容器的运行进程
#### docker stats
显示容器资源使用情况统计信息的实时流
* [故障排查](http://link.zhihu.com/?target=https%3A//yq.aliyun.com/articles/59144))
* 练习构建容器镜像，与镜像管理
从 Dockerfile 构建镜像
```
docker build [options] context
```
## 容器编排基础
### 学习 Docker Compose 基本概念
Compose 负责实现对 Docker 容器集群的快速编排。它的定位是*定义和运行多个 Docker 容器的应用*。

通常我们在运行一个应用的时候，往往需要运行多个容器。比如一个 web 项目，除了 Web 服务容器本身，还需要数据库容器，nginx 容器等。
这时候就可以通过 `docker-compose.yml` 来定义一组相关联的应用容器为一个项目。

Compose 中两个最重要概念：
* 服务 service：一个应用的容器，实际上可以包括若个运行相同镜像的容器实例。
* 项目 project：由一组关联的应用容器组成的一个完整业务单元。

Compose 的核心是模板文件 template，通过 template 来定义 project 与 service。


### 练习
#### 利用 docker compose 管理应用项目生命周期
##### 创建、删除、检查、启动、停止容器

构建容器
```
docker-compose up [options]
```
该命令十分强大，它将尝试自动完成包括构建镜像、（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。

其中 options 包括：
* `-d`  后台运行
* `--no-color`  不使用颜色来区分不同的服务的控制台输出
* `--no-deps`  不启动服务所链接的容器
* `--force-recreate`  强制重新创建容器，不能与`--no-recreate`  同时使用
* `--no-recreate` 如果容器已经存在，则不重新创建容器，不能与  `--force-recreate` 同时使用
* `--no-build` 不自动构建缺失的服务镜像
* `-t`  超时设置，默认10s，超过该时间则停止容器

当 docker-compose.yml 或者其他文件发生改变时，可以通过 
```
docker-compose up -d --force-recreate --build 
```
来强制更新镜像，重启容器。


删除容器
```
docker-compose rm
```	
删除所有处于停止状态的容器

启动容器
```
docker-compose start [options] [SERVICE...]
```
该命令可以启动已经存在的服务容器

停止容器
```
docker-compose stop [options] [SERVICE...]

// 强制停止服务容器
docker-compose kill -s SIGINT
```
该命令停止已经处于运行状态的容器，但不删除。可以通过 `docker-compose start`    再次启动这些容器
#### 利用 docker compose 构建镜像
可以使用  `docker-compose build` 来构建镜像


## 完整示例
[Docker Compose 实践：使用 Docker Compose 部署 nginx + Node.js + Mongodb服务](https://github.com/superman66/docker-demo)

使用 docker-compose 来构建一个最简单的一个前后端分离服务。前端使用 react，构建后用 nginx 作为 web 服务器。后端使用 node + mongodb。通过 docker-compose 实践来体会 docker 在部署服务上相较于传统的部署方式所带来的高效与便捷。

## 参考资料
* [Docker学习路线图（配基于阿里云容器服务实践教程） - 知乎](https://zhuanlan.zhihu.com/p/26221700)
* [Dokcer — 从入门到实践](https://yeasy.gitbooks.io/docker_practice/content/)
