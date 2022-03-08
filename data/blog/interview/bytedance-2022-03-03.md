---
title: 2022-03-03 字节跳动面试 记录
lastmod: '2022-03-07'
date: '2022-03-07'
tags: ['总结', '面试', '复盘']
draft: false
summary: 2022-03-03 字节跳动面试 问题复盘记录
---


## 1. 浏览器 进程线程 JS运行 原理

### 进程

    进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位）

    线程是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）

浏览器是多进程的，每打开一个Tab页，就相当于创建了一个独立的浏览器进程。浏览器包括以下几个主要的进程：

1. Browser进程：浏览器的主控进程，只有一个。
    - 负责浏览器界面显示，与用户交互。如前进，后退等
    - 负责各个页面的管理，创建和销毁其他进程
    - 将Renderer进程得到的内存中的Bitmap，绘制到用户界面上
    - 网络资源的管理，下载等
2. 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
3. GPU进程：最多一个，用于3D绘制等
4. 浏览器渲染进程（浏览器内核）（Renderer进程，内部是多线程的）：默认每个Tab页面一个进程，互不影响。
   - 主要作用为页面渲染，脚本执行，事件处理等

### 主要的线程
- GUI渲染线程

    负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等。当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行注意，GUI渲染线程与JS引擎线程是互斥的，当JS引擎执行时GUI线程会被挂起，GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行。

- JS引擎线程

    也称为JS内核，负责处理Javascript脚本程序。JS引擎线程负责解析Javascript脚本，运行代码。JS引擎一直等待着任务队列中任务的到来，然后加以处理，一个Tab页（renderer进程）中无论什么时候都只有一个JS线程在运行JS程序同样注意，GUI渲染线程与JS引擎线程是互斥的，所以如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

- 事件触发线程

    归属于浏览器而不是JS引擎，用来控制事件循环（可以理解，JS引擎自己都忙不过来，需要浏览器另开线程协助），当JS引擎执行代码块如setTimeOut时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX异步请求等），会将对应任务添加到事件线程中，当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理。注意，由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）

- 定时触发器线程

    setInterval与setTimeout所在线程
    浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
    因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待JS引擎空闲后执行）
    注意，W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。

- 异步http请求线程

    在XMLHttpRequest在连接后是通过浏览器新开一个线程请求，当检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由JavaScript引擎执行。

### 主控进程Browser进程对渲染进程的控制过程

- Browser进程收到用户请求，首先需要获取页面内容（譬如通过网络下载资源），随后将该任务通过RendererHost接口传递给Render进程
- Renderer进程的Renderer接口收到消息，简单解释后，交给渲染线程，然后开始渲染
    - 渲染线程接收请求，加载网页并渲染网页，这其中可能需要Browser进程获取资源和需要GPU进程来帮助渲染
    - 当然可能会有JS线程操作DOM（这样可能会造成回流并重绘）
    - 最后Render进程将结果传递给Browser进程
- Browser进程接收到结果并将结果绘制出来。

### js运行机制
由于js是单线程，所以对于任务的执行自然会有一个顺序，称之为任务队列，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。所以任务又分为两种，一种是同步任务：指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。另一种是异步任务：指的是不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。
```
1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
2. 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。
```
---
## 2. 实现一个flat函数
要求 ```function _flat(num){}```

```num```为展开层数

方式1
```
Array.prototype._flat = function(num) {
    var arr = [];
    for(let item of this) {
        if (num <= 0) {
            break;
        }

        let currentNum = num - 1;
        if(Array.isArray(item)) {
            arr = arr.concat(item.flat(currentNum))
        }
        else {
            arr.push(item);
        }
    }

    return arr;
}
```

方式2(仅实现了不含num的)
```
Array.prototype._flat = function() {
    return this.toString().split(",").map(item => +item);
}
```
---
## 3. React Native 渲染原理
React Native 渲染主要涉及3个线程
- Main Thread: UI Thread 负责UI渲染
- JavaScript Thread: JSCore 引擎 解析执行JS代码
- Shadow Thread: 维护一个Tree 计算布局 然后通过Bridge 通知UI Thread

线程间通讯使用JSBridge,但是当数据量大的时候诸如图片传输base64时 会出现渲染不及时 然后出现高度随意乱跳问题.同时JS层也无法像在浏览器上一样直接调用Native Code

渲染流程简述:
- Native 打开 RN 页面
- JS 线程运行，Virtual DOM Tree 被创建
- JS 线程异步通知 Shadow Thread 有节点变更
- Shadow Thread 创建 Shadow Tree
- Shadow Thread 计算布局，异步通知 Main Thread 创建 Views
- Main Thread 处理 View 的创建，展示给用户

### Bridge 架构 与 Fabric架构
Bridge架构缺点:
- 有两个不一样的领域：JS和Native，他们彼此之间并不能真正互相感知，而且也不能共享相同的内存。
- 它们之间的通讯是基于Bridge的异步通讯。可是这也意味着，并不能保证数据100%并及时地到达另外一侧。
- 传输大数据很是慢，由于内存不能共享，全部在js和native之间传输的数据都是一次新的复制。
- 没法同步更新UI。比方说有个FlatList，当我滑动的时候会加载大量的数据。在某些边界场景，当有用户界面交互，但数据尚未返回，屏幕可能会发生闪烁。
- RN代码仓库太大了。致使库更重，开源社区贡献代码或发布修复也更慢。

![](/static/assets/interview/bridge.jpg)
![](/static/assets/interview/fabric.jpg)

Farbic架构
1. JSI -- 为了让JS和Native可以互相感知。将再也不须要经过Bridge传输序列化JSON。将容许Native对象被导出成Js对象，反过来也能够。两侧也会导出能够被同步调用的API。实际上，架构的其余部分都是基于这个之上的
2. Fabric -- UIManager的新名称，将负责Native端渲染。和当前的Bridge不一样的是，它能够经过JSI导出本身的Native函数，在JS层能够直接使用这些函数引用，反过来，Native层也能够直接调用JS层。这带来更好更高效的性能和数据传输。
3. Turbo Modules。记得上面的Native组件吗？Text、Image、View，他们的新名字叫Turbo Modules。组件的做用是相同的，可是实现和行为会不一样。第一，他们是懒加载的（只有当App须要的时候加载），而如今是在启动时所有加载。另外，他们也是经过JSI导出的，因此JS能够拿到这些组件的引用，而且在React Natvie JS里使用他们。尤为会在启动的时候带来更好的性能表现。
4. CodeGen -- 为了让JS侧成为两端通讯时的惟一可信来源。它可让开发者建立JS的静态类，以便Native端（Fabric和Turbo Modules）能够识别它们，而且避免每次都校验数据 => 将会带来更好的性能，而且减小传输数据出错的可能性。
5. Lean Core -- 是对React Native库架构的变化。目的是减轻lib的负担，并帮助社区更快地解决更多pull request。

---
## 4. 实现前端路由
### Hash实现:
通过 hashchange 事件监听 URL 的变化，改变 URL 的方式只有这几种：通过浏览器前进后退改变 URL、通过`<a>`标签改变 URL、通过window.location改变URL，这几种情况改变 URL 都会触发 hashchange 事件
```html
<body>
  <ul>
    <!-- 定义路由 -->
    <li><a href="#/home">home</a></li>
    <li><a href="#/about">about</a></li>

    <!-- 渲染路由对应的 UI -->
    <div id="routeView"></div>
  </ul>
</body>
```
```js
// 页面加载完不会触发 hashchange，这里主动触发一次 hashchange 事件
window.addEventListener('DOMContentLoaded', onLoad)
// 监听路由变化
window.addEventListener('hashchange', onHashChange)

// 路由视图
var routerView = null

function onLoad () {
  routerView = document.querySelector('#routeView')
  onHashChange()
}

// 路由变化时，根据路由渲染对应 UI
function onHashChange () {
  switch (location.hash) {
    case '#/home':
      routerView.innerHTML = 'Home'
      return
    case '#/about':
      routerView.innerHTML = 'About'
      return
    default:
      return
  }
}
```
### History实现
history 提供了 pushState 和 replaceState 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新

history 提供类似 hashchange 事件的 popstate 事件，但 popstate 事件有些不同：通过浏览器前进后退改变 URL 时会触发 popstate 事件，通过pushState/replaceState或<a>标签改变 URL 不会触发 popstate 事件。好在我们可以拦截 pushState/replaceState的调用和`<a>`标签的点击事件来检测 URL 变化，所以监听 URL 变化可以实现，只是没有 hashchange 那么方便。

```html
<body>
  <ul>
    <!-- 定义路由 -->
    <li><a href="/home">home</a></li>
    <li><a href="/about">about</a></li>

    <!-- 渲染路由对应的 UI -->
    <div id="routeView"></div>
  </ul>
</body>
```
```js
window.addEventListener('DOMContentLoaded', onLoad)
// 监听路由变化
window.addEventListener('popstate', onPopState)

// 路由视图
var routerView = null

function onLoad () {
  routerView = document.querySelector('#routeView')
  onPopState()

  // 拦截 <a> 标签点击事件默认行为， 点击时使用 pushState 修改 URL并更新手动 UI，从而实现点击链接更新 URL 和 UI 的效果。
  var linkList = document.querySelectorAll('a[href]')
  linkList.forEach(el => el.addEventListener('click', function (e) {
    e.preventDefault()
    history.pushState(null, '', el.getAttribute('href'))
    onPopState()
  }))
}

// 路由变化时，根据路由渲染对应 UI
function onPopState () {
  switch (location.pathname) {
    case '/home':
      routerView.innerHTML = 'Home'
      return
    case '/about':
      routerView.innerHTML = 'About'
      return
    default:
      return
  }
}
```
[^1]: 转载自 https://www.cnblogs.com/lguow/p/10921564.html
---

---
## 5. 实现H5 NavBar
```
const RootView = (props) => {
  document.title = props.title;
  return (
    <>
      <div className={!props.noNav && false ? 'root-view' : 'root-view-without-nav'}>
        <>
            <LeftIcon />
            <Title />
            <RightIcon />
        </>
        <>
            {props.children}
        </>
      </div>
    </>
  );
};

export {
  RootView
};
```