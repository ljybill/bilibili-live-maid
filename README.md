# bilibili-live-maid

B站直播助手，目前只支持展示用户入场和用户弹幕消息信息。

## TODO

- [ ] 支持展示所有的直播间消息。
- [ ] 设计主窗口和弹幕看板窗口。主窗口可以设置弹幕看板的监听房间。
- [ ] 代码解耦
- [ ] 研究vue打包后的hash和history模式



## 如何开发

本项目使用的技术栈是：[ts](https://jkchao.github.io/typescript-book-chinese/#why) + [vue3](https://v3.cn.vuejs.org/guide/introduction.html) + [electron](https://www.electronjs.org/docs) + [electron-forge(打包)](https://www.electronforge.io/)



clone项目之后，可以先看下`package.json`文件的脚本。

```sh
npm run serve  # 启动vue开发服务器
npm run build  # 打包vue项目

npm run dev:electron  # 启动electron项目，注意这并不是热更新的，也就是说你改动electron端的代码后需要重新启动此脚本
npm run start  # 具体可以查看下文档，我还没有执行过这个脚本，应该类似npm run dev:electron
npm run make   # 打包 electron 项目
```

因为electron的镜像在国外，下载速度很慢，推荐先执行`npm run proxy`里面的脚本。

解释下这行指令

```sh
export ELECTRON_CUSTOM_DIR="11.2.1" && export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
```

此指令是设置当前终端窗口的**临时**环境变量。会设置electron镜像为国内地址。具体可以查看https://www.electronjs.org/docs/tutorial/installation#%E4%BB%A3%E7%90%86 官方文档。

另外，上面的命令只在linux 和 mac终端上起作用，原因是export是此类操作系统终端特有命令，大家可以自行查看windows如何设置环境变量，我后续有机会会尝试下，然后补充此文档。

src目录下是vue3项目，electron目录是electron项目

准备工作做好之后，我们就可以开发代码了。我们先启动`npm run serve`启动vue项目，然后`npm run dev:electron`启动electron项目。注意，目前阶段只能在electron中调试vue项目，因为vue项目依赖了‘electron’模块，在浏览器直接打开会因为没有此模块而报错。



## 如何打包

开发到一定阶段了，我们可能希望把它打包成一个桌面应用。我们需要先编译vue项目：`npm run build`，然后再修改electron的main.js代码，修改mainWindow的loadUrl -> loadFile，指向打包后的vue项目。

最后，执行npm run make就可以等待包产出了🤓



## 关于此项目

此项目使用的技术都是我所不熟悉的，所以开发过程中会遇到很多阻碍。但是我也是把它当做一个学习项目来做的。把TypeScript、Vue3、electron各个环节都串起来。

在开发初期可能会以快速开发功能为目标，当功能开发完成后，会把遗留的坑补一补，提高代码的简洁性。再去开发下一个需求。



## QA

1. 为何诞生此项目

   在mac上官方并没有提供一个好用的弹幕姬，导致mac电脑直播不方便看弹幕。之后找了款开源工具但是发现作者已经闭源维护了，并且由于种种原因作者停止维护了一些功能。又因为vue3出来之后一直没机会尝试，就做了这个项目进行vue3的学习。

2. 我不想开发，只想使用开发好的工具。

   可以的，但是现阶段此软件可能无法满足你的需求。如果你有使用上的需求，可以提出issue。开发者会考虑是否开发。

2. 我可以提PR吗？

   欢迎各种形式帮助此项目，很荣幸收到你的PR。我会帮助你进行code review。