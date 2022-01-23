# 开箱即用的 svg 格式化脚本

项目里的功能越多，用到的 svg 就会越多，以至于写一个标准化 svg 图标内容的脚本变得很有必要。

根据 svg 复用的方式，采用 symbol 和 use 来引用 svg。

```html
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-xxx"></use>
</svg>
```

1. 这样写的前提就是需要有 js 脚本提前注入，这是在 node 服务中模拟的获取脚本文件的接口，目的是为了生成这么一个 js，在执行的时候，将所有格式化后的 svg 图标拼接并注入到 svg 中而达到直接 use 使用的目的。

```js
async downloadSvgJs(iconIdList,prefix) {
    let js=`
    let symbolSvgs = '<symbol>template</symbol>';
    let svgSprite = "<svg>" + symbolSvgs + "</svg>";
    let script = function () {
        let scripts = document.getElementsByTagName("script");
        return scripts[scripts.length - 1];
    }();
    let shouldInjectCss = script.getAttribute("data-injectcss");
    let before = function (el, target) {
        target.parentNode.insertBefore(el, target);
    }
    let prepend = function (el, target) {
        if (target.firstChild) {
            before(el, target.firstChild);
        } else {
            target.appendChild(el);
        }
    };
    // 最终返回一个append方法
    function appendSvg() {
        let div, svg;
        div = document.createElement("div");
        div.innerHTML = svgSprite;
        svgSprite = null;
        svg = div.getElementsByTagName("svg")[0];
        if (svg) {
            svg.setAttribute("aria-hidden", "true");
            svg.style.position = "absolute";
            svg.style.width = 0;
            svg.style.height = 0;
            svg.style.overflow = "hidden";
            prepend(svg, document.body);
        }
    }
    if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
        window.__iconfont__svg__cssinject__ = true;
        try {
            document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
        } catch (e) {
            console && console.log(e)
        }
    }
    export default appendSvg;`
    // 以下为模拟的从数据库获取所有图标的操作，可自行跳过
    if (iconIdList.length > 0) {
        const sqlitedb = new SqliteDB(dateBase);
        let sql = `SELECT * FROM icon WHERE`
        iconIdList.forEach((item, index) => {
            index === 0 ? sql += ` ICON_ID =${item}` : sql += ` OR ICON_ID =${item}`
        })
        let res = await sqlitedb.selectAll(sql);
        let allSvg=''
        res.map(item => {
            item.ICON_CONTENT = svgFormat(item.ICON_CONTENT).replace(/svg/g, 'symbol').replace(/[\r\n]/g, "")
            item.ICON_CONTENT=item.ICON_CONTENT.slice(0,7)+` id="svg-${item.ICON_KEY}" `+item.ICON_CONTENT.slice(7)
            allSvg+=item.ICON_CONTENT
        })
        let result=js.replace('<symbol>template</symbol>',allSvg)
        return Promise.resolve(Buffer.from(result, 'utf-8'))
    } else {
        return Promise.resolve(Buffer.from(js.replace('<symbol>template</symbol>',''), 'utf-8'))

    }

}
```

2. svg 格式化：上面的代码中，svgFormat 方法对每个 svg 图标进行了格式化，用到了一些简单的辅助函数，具体操作如下：

```js
/**
 * @svgFormat 格式化svg字符串
 * @param {String} string svg字符串
 */
function svgFormat(string) {
  let viewBoxAttr = getAttr("viewBox", string);
  let styleAttr = getAttr("style", string);
  let styleTag = "";
  if (string.indexOf("<style") > 0) {
    //分割出该svg的style标签
    styleTag = getTag('<style type="text/css">', "</style>", string);
  }
  // 分割出<svg...></svg>标签内所有内容
  let svgBeginStr = string.match(/<svg[^<>]+>/g)[0]; //匹配出<svg ...>
  let begin = string.indexOf(svgBeginStr) + svgBeginStr.length;
  let lastIndex = string.lastIndexOf("</svg");
  content = string.substr(begin, lastIndex).split("</svg>")[0]; //获取svg图像内容
  //去掉style标签
  let styleLeft = content.indexOf("<style");
  let styleRight = content.indexOf("</style>");
  content =
    content.indexOf("<style") > 0
      ? content.substr(0, styleLeft) +
        content.substr(styleRight + "</style>".length)
      : content;
  //手动插入class样式
  let classObj = {};
  let classArr = styleTag.match(/.st\d{.+}/g); //匹配出style标签所有class
  if (classArr && classArr.length > 0) {
    classArr.map((item) => {
      let key = item.split("{")[0].split(".")[1];
      let value = item.split("{")[1].split("}")[0];
      classObj[key] = value;
    });
    for (let key in classObj) {
      //找出对应class 并拼接style 字符串
      content = getContent(key, classObj, content, 0); //递归插入有相同class的标签style
    }
  }
  let res = `<svg class="icon" style="${styleAttr} " viewBox="${viewBoxAttr}" version="1.1" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  return res;
}
```

```js
/**
 * @getContent 递归插入有相同class的标签style
 * @param {String} key 类名
 * @param {Object} classObj 类名和style映射对象
 * @param {String} content 要处理的字符串内
 * @param {String} startIndex 开始查找的index
 */

function getContent(key, classObj, content, startIndex) {
  let classIndex = content.indexOf(`"${key}"`, startIndex);
  if (classIndex > 0) {
    // 若后面还有同一class则继续递归插入style
    let insertIndex = classIndex + key.length + 2;
    let res =
      content.slice(0, insertIndex) +
      ` style="${classObj[key]}"` +
      content.slice(insertIndex);
    return getContent(key, classObj, res, insertIndex);
  } else {
    //没有 则返回内容
    return conten;
  }
}
```

```js
/**
 * @getTag 获取svg标签及内容
 * @param {String} start 开始标签
 * @param {String} end 结束标签
 * @param {String} str svg字符串
 * @param {Boolean} getAll 是否获取多个该标签
 */

function getTag(start, end, str, getAll = false) {
  let begin = str.indexOf(start);
  let temp = str.substr(begin);
  if (getAll) {
    let lastIndex = temp.lastIndexOf(end);
    return temp.substr(0, lastIndex) + end;
  } else {
    return temp.split(end)[0] + en;
  }
}
```

```js
/**
 * @getAttr 获取svg单个属性
 * @param {String} attr 属性名
 * @param {String} str svg字符串
 */

function getAttr(attr, str) {
  let begin = str.indexOf(`${attr}="`);
  let temp = str.substr(begin);
  let res = temp.split(`"`)[1];
  return res;
}
```

经过最前面 downloadSvgJs 方法获取的 js 文件，在工程中引入执行该脚本，就可以对所有格式化后的 svg 进行复用，再也不用在工程目录下看到一大坨的 svg 文件了。（ps:如果 svg 无法正常显示，那就要问问你们的 UI 小姐姐提供的 svg 是不是有点什么毛病了）
