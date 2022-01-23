# CLI 和 npm-scipts

在搭建项目脚手架时，我们通常会使用到命令行(cli)工具，cli = Command-Line Interface，比方说 vue-cli、create-react-app、webpack 等。 举个例子，使用 vue-cli 工具搭建的项目，根目录下的 package.json 会含有 scripts 字段。当用户在终端中输入该脚本命令后，就会启动进程。

```shell
npm run serve
# 等同于执行
vue-cli-service serve
```

## 原理

每当执行 npm run 命令时，都会创建一个 shell 脚本，并在脚本里写入相应属性值。例如

```json
"scripts" : {
    "dev": "node app.js"
}
```

这就意味着实际上，shell 执行的命令是 node app.js。

npm run 新建的这个 Shell，会将当前目录的 node_modules/.bin 子目录加入 PATH 变量，执行结束后，再将 PATH 变量恢复原样。 这意味着，当前目录的 node_modules/.bin 子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。比如，当前项目的依赖里面有 Mocha，只要直接写 mocha test 就可以了。

## 脚本文件的原理

结合上节内容，我们知道了 npm scripts 的实质就是创建一个 shell 文件，并把当前目录中/node_modules/.bin 文件夹下的脚本文件加入到 PATH 变量中。那问题又来了，脚本文件是怎么写的呢？ 还是按照 vue-cli 为例，我们打开该文件。

```javascript
#!/usr/bin/env node

const semver = require('semver')
const { error } = require('@vue/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
    error(
    `You are using Node ${process.version}, but vue-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    )
    process.exit(1)
}

const Service = require('../lib/Service')
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())

const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
boolean: [
    // build
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
    ]
})
const command = args.\_[0]

service.run(command, args, rawArgv).catch(err => {
    error(err)
    process.exit(1)
})
```

虽说这是个 shell 文件，但实际上语法完全和 node.js 相同。这实际上是通过这一段文字，指定了解析器。

#!/usr/bin/env node 这个被称之为 "shebang"，它名称的具体的解释很多种。

还有一个重点就是，当我们本地安装这些 npm 模块时，如果是 package.json 有 bin 字段，就会在本地/node_modules/.bin 文件夹下创建对应的软链接。
