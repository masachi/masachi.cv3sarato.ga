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

## 3. React Native 渲染原理
// TODO

## 4. 实现前端路由
// TODO


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