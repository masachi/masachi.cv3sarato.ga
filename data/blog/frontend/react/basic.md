---
title: React
lastmod: '2022-03-08'
date: '2022-03-04'
tags: ['摸鱼', '前端']
draft: false
summary: 
---

# React 基础概念

## 1. 包结构

> React 工程目录的 packages 下包含 35 个包([`@17.0.2`版本](https://github.com/facebook/react/tree/v17.0.2)).
> 其中与`web`开发相关的核心包共有 4 个, 本系列近 20 篇文章, 以这 4 个包为线索进行展开, 深入理解 react 内部作用原理.

### 基础包结构

1. react

   > react 基础包, 只提供定义 react 组件(`ReactElement`)的必要函数, 一般来说需要和渲染器(`react-dom`,`react-native`)一同使用. 在编写`react`应用的代码时, 大部分都是调用此包的 api.

2. react-dom

   > react 渲染器之一, 是 react 与 web 平台连接的桥梁(可以在浏览器和 nodejs 环境中使用), 将`react-reconciler`中的运行结果输出到 web 界面上. 在编写`react`应用的代码时,大多数场景下, 能用到此包的就是一个入口函数`ReactDOM.render(<App/>, document.getElementByID('root'))`, 其余使用的 api, 基本是`react`包提供的.

3. react-reconciler

   > react 得以运行的核心包(综合协调`react-dom`,`react`,`scheduler`各包之间的调用与配合).
   > 管理 react 应用状态的输入和结果的输出. 将输入信号最终转换成输出信号传递给渲染器.

   - 接受输入(`scheduleUpdateOnFiber`), 将`fiber`树生成逻辑封装到一个回调函数中(涉及`fiber`树形结构, `fiber.updateQueue`队列, 调和算法等),
   - 把此回调函数(`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`)送入`scheduler`进行调度
   - `scheduler`会控制回调函数执行的时机, 回调函数执行完成后得到全新的 fiber 树
   - 再调用渲染器(如`react-dom`, `react-native`等)将 fiber 树形结构最终反映到界面上

4. scheduler

   > 调度机制的核心实现, 控制由`react-reconciler`送入的回调函数的执行时机, 在`concurrent`模式下可以实现任务分片. 在编写`react`应用的代码时, 同样几乎不会直接用到此包提供的 api.

   - 核心任务就是执行回调(回调函数由`react-reconciler`提供)
   - 通过控制回调函数的执行时机, 来达到任务分片的目的, 实现可中断渲染(`concurrent`模式下才有此特性)

react 应用整体结构分为接口层(`api`)和内核层(`core`)

1. 接口层(api)
   `react`包, 平时在开发过程中使用的绝大部分`api`均来自此包(不是所有). 在`react`启动之后, 正常可以改变渲染的基本操作有 3 个.

   - class 组件中使用`setState()`
   - function 组件里面使用 hook,并发起`dispatchAction`去改变 hook 对象
   - 改变 context(其实也需要`setState`或`dispatchAction`的辅助才能改变)

   以上`setState`和`dispatchAction`都由`react`包直接暴露. 所以要想 react 工作, 基本上是调用`react`包的 api 去与其他包进行交互.

2. 内核层(core)
   整个内核部分, 由 3 部分构成:
   1. 调度器
      `scheduler`包, 核心职责只有 1 个, 就是执行回调.
      - 把`react-reconciler`提供的回调函数, 包装到一个任务对象中.
      - 在内部维护一个任务队列, 优先级高的排在最前面.
      - 循环消费任务队列, 直到队列清空.
   2. 构造器
      `react-reconciler`包, 有 3 个核心职责:
      1. 装载渲染器, 渲染器必须实现[`HostConfig`协议](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/README.md#practical-examples)(如: `react-dom`), 保证在需要的时候, 能够正确调用渲染器的 api, 生成实际节点(如: `dom`节点).
      2. 接收`react-dom`包(初次`render`)和`react`包(后续更新`setState`)发起的更新请求.
      3. 将`fiber`树的构造过程包装在一个回调函数中, 并将此回调函数传入到`scheduler`包等待调度.
   3. 渲染器
      `react-dom`包, 有 2 个核心职责:
      1. 引导`react`应用的启动(通过`ReactDOM.render`).
      2. 实现[`HostConfig`协议](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/README.md#practical-examples)([源码在 ReactDOMHostConfig.js 中](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/client/ReactDOMHostConfig.js)), 能够将`react-reconciler`包构造出来的`fiber`树表现出来, 生成 dom 节点(浏览器中), 生成字符串(ssr).

![](/static/assets/react/core-packages.png)

注意:
- 红色方块代表入口函数, 绿色方块代表出口函数.
- package 之间的调用脉络就是通过板块间的入口和出口函数连接起来的.

## 2. 工作循环

![](/static/assets/react/workloop.png)


- 任务调度循环: [`Scheduler.js`](https://github.com/facebook/react/blob/v17.0.2/packages/scheduler/src/Scheduler.js), `react`应用得以运行的保证, 它需要循环调用, 控制所有任务(`task`)的调度.

- fiber构造循环: [`ReactFiberWorkLoop.js`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js), 控制 fiber 树的构造, 整个过程是一个深度优先遍历.

这两个循环对应的 js 源码不同于其他闭包(运行时就是闭包), 其中定义的全局变量, 不仅是该作用域的私有变量, 更用于`控制react应用的执行过程`.

### 区别与联系

1. 区别

   - `任务调度循环`是以`二叉堆`为数据结构(详见[react 算法之堆排序](../algorithm/heapsort.md)), 循环执行`堆`的顶点, 直到`堆`被清空.
   - `任务调度循环`的逻辑偏向宏观, 它调度的是每一个任务(`task`), 而不关心这个任务具体是干什么的(甚至可以将`Scheduler`包脱离`react`使用), 具体任务其实就是执行回调函数`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`.
   - `fiber构造循环`是以`树`为数据结构, 从上至下执行深度优先遍历(详见[react 算法之深度优先遍历](../algorithm/dfs.md)).
   - `fiber构造循环`的逻辑偏向具体实现, 它只是任务(`task`)的一部分(如`performSyncWorkOnRoot`包括: `fiber`树的构造, `DOM`渲染, 调度检测), 只负责`fiber`树的构造.

2. 联系
   - `fiber构造循环`是`任务调度循环`中的任务(`task`)的一部分. 它们是从属关系, 每个任务都会重新构造一个`fiber`树.

react 运行的主干逻辑, 即将`输入转换为输出`的核心步骤, 实际上就是围绕这两大工作循环进行展开.

1. 输入: 将每一次更新(如: 新增, 删除, 修改节点之后)视为一次`更新需求`(目的是要更新`DOM`节点).
2. 注册调度任务: `react-reconciler`收到`更新需求`之后, 并不会立即构造`fiber树`, 而是去调度中心`scheduler`注册一个新任务`task`, 即把`更新需求`转换成一个`task`.
3. 执行调度任务(输出): 调度中心`scheduler`通过`任务调度循环`来执行`task`(`task`的执行过程又回到了`react-reconciler`包中).
   - `fiber构造循环`是`task`的实现环节之一, 循环完成之后会构造出最新的 fiber 树.
   - `commitRoot`是`task`的实现环节之二, 把最新的 fiber 树最终渲染到页面上, `task`完成.


## 3. React 应用中的高频对象
### react 包

此包定义 react 组件(`ReactElement`)的必要函数, 提供一些操作`ReactElement`对象的 api.

这个包的核心需要理解`ReactElement`对象, 假设有如下入口函数:

```js
// 入口函数
ReactDOM.render(<App />, document.getElementById('root'));
```

可以简单的认为, 包括`<App/>`及其所有子节点都是`ReactElement`对象(在 render 之后才会生成子节点, 后文详细解读), 每个`ReactElement`对象的区别在于 type 不同.

#### [ReactElement 对象](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactElement.js#L126-L146)

> 其 type 定义在[`shared`包中](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactElementType.js#L15).

所有采用`jsx`语法书写的节点, 都会被编译器转换, 最终会以`React.createElement(...)`的方式, 创建出来一个与之对应的`ReactElement`对象.

`ReactElement`对象的数据结构如下:

```ts
export type ReactElement = {|
  // 用于辨别ReactElement对象
  $$typeof: any,

  // 内部属性
  type: any, // 表明其种类
  key: any,
  ref: any,
  props: any,

  // ReactFiber 记录创建本对象的Fiber节点, 还未与Fiber树关联之前, 该属性为null
  _owner: any,

  // __DEV__ dev环境下的一些额外信息, 如文件路径, 文件名, 行列信息等
  _store: {validated: boolean, ...},
  _self: React$Element<any>,
  _shadowChildren: any,
  _source: Source,
|};

```

需要特别注意 2 个属性:

1. `key`属性在`reconciler`阶段会用到, 目前只需要知道所有的`ReactElement`对象都有 key 属性(且[其默认值是 null](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactElement.js#L348-L357), 这点十分重要, 在 diff 算法中会使用到).

2. `type`属性决定了节点的种类:

   - 它的值可以是字符串(代表`div,span`等 dom 节点), 函数(代表`fuction, class`等节点), 或者 react 内部定义的节点类型(`portal,context,fragment`等)
   - 在`reconciler`阶段, 会根据 type 执行不同的逻辑

在`v17.0.2`中, [定义了 20 种](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactSymbols.js#L16-L37)内部节点类型. 根据运行时环境不同, 分别采用 16 进制的字面量和`Symbol`进行表示.

### [ReactComponent](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactBaseClasses.js#L20-L30)对象

对于`ReactElement`来讲, `ReactComponent`仅仅是诸多`type`类型中的一种.

```js
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <header>header</header>
        <Content />
        <footer>footer</footer>
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </React.Fragment>
    );
  }
}

export default App;
```

编译之后的代码(此处只编译了 jsx 语法, 并没有将 class 语法编译成 es5 中的 fuction), 可以更直观的看出调用逻辑.

`createElement`函数的第一个参数将作为创建`ReactElement`的`type`. 可以看到`Content`这个变量被编译器命名为`App_Content`, 并作为第一个参数(引用传递), 传入了`createElement`.

```js
class App_App extends react_default.a.Component {
  render() {
    return /*#__PURE__*/ react_default.a.createElement(
      'div',
      {
        className: 'app',
      } /*#__PURE__*/,
      react_default.a.createElement('header', null, 'header') /*#__PURE__*/,

      // 此处直接将Content传入, 是一个指针传递
      react_default.a.createElement(App_Content, null) /*#__PURE__*/,
      react_default.a.createElement('footer', null, 'footer'),
    );
  }
}
class App_Content extends react_default.a.Component {
  render() {
    return /*#__PURE__*/ react_default.a.createElement(
      react_default.a.Fragment,
      null /*#__PURE__*/,
      react_default.a.createElement('p', null, '1'),
      /*#__PURE__*/

      react_default.a.createElement('p', null, '2'),
      /*#__PURE__*/

      react_default.a.createElement('p', null, '3'),
    );
  }
}
```

上述示例演示了`ReactComponent`是诸多`ReactElement`种类中的一种情况, 但是由于`ReactComponent`是 class 类型, 自有它的特殊性(可[对照源码](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactBaseClasses.js), 更容易理解).

1. `ReactComponent`是 class 类型, 继承父类`Component`, 拥有特殊的方法(`setState`,`forceUpdate`)和特殊的属性(`context`,`updater`等).
2. 在`reconciler`阶段, 会依据`ReactElement`对象的特征, 生成对应的 fiber 节点. 当识别到`ReactElement`对象是 class 类型的时候, 会触发`ReactComponent`对象的生命周期, 并调用其 `render`方法, 生成`ReactElement`子节点.

### 其他`ReactElement`

上文介绍了第一种特殊的`ReactElement`(`class`类型的组件), 除此之外`function`类型的组件也需要深入了解, 因为`Hook`只能在`function`类型的组件中使用.

如果在`function`类型的组件中没有使用`Hook`(如: `useState`, `useEffect`等), 在`reconciler`阶段所有有关`Hook`的处理都会略过, 最后调用该`function`拿到子节点`ReactElement`.

如果使用了`Hook`, 逻辑就相对复杂, 涉及到`Hook`创建和状态保存(有关 Hook 的原理部分, 在 Hook 原理章节中详细解读). 此处只需要了解`function`类型的组件和`class`类型的组件一样, 是诸多`ReactElement`形式中的一种.

### `ReactElement`内存结构

通过前文对`ReactElement`的介绍, 可以比较容易的画出`<App/>`这个`ReactElement`对象在内存中的结构(`reconciler`阶段完成之后才会形成完整的结构).


![](/static/assets/react/reactelement-tree.png)

注意:
- `class`和`function`类型的组件,其子节点是在 render 之后(`reconciler`阶段)才生成的. 此处只是单独表示`ReactElement`的数据结构.
- 父级对象和子级对象之间是通过`props.children`属性进行关联的(与 fiber 树不同).
- `ReactElement`虽然不能算是一个严格的树, 也不能算是一个严格的链表. 它的生成过程是至顶向下的, 是所有组件节点的总和.
- `ReactElement`树(暂且用树来表述)和`fiber`树是以`props.children`为单位`先后交替`生成的(在 fiber 树构建章节详细解读), 当`ReactElement`树构造完毕, fiber 树也随后构造完毕.
- `reconciler`阶段会根据`ReactElement`的类型生成对应的`fiber`节点(不是一一对应, 比如`Fragment`类型的组件在生成`fiber`节点的时候会略过).

### `react-reconciler` 包

`react-reconciler`包是`react`应用的中枢, 连接渲染器(`react-dom`)和调度中心(`scheduler`), 同时自身也负责 fiber 树的构造.
`fiber`是核心, react 体系的渲染和更新都要以 fiber 作为数据模型, 如果不能理解 fiber, 也无法深入理解 react.

### Fiber 对象

先看数据结构, 其 type 类型的定义在[`ReactInternalTypes.js`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactInternalTypes.js#L47-L174)中:

```js
// 一个Fiber对象代表一个即将渲染或者已经渲染的组件(ReactElement), 一个组件可能对应两个fiber(current和WorkInProgress)
// 单个属性的解释在后文(在注释中无法添加超链接)
export type Fiber = {|
  tag: WorkTag,
  key: null | string,
  elementType: any,
  type: any,
  stateNode: any,
  return: Fiber | null,
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,
  ref:
    | null
    | (((handle: mixed) => void) & { _stringRef: ?string, ... })
    | RefObject,
  pendingProps: any, // 从`ReactElement`对象传入的 props. 用于和`fiber.memoizedProps`比较可以得出属性是否变动
  memoizedProps: any, // 上一次生成子节点时用到的属性, 生成子节点之后保持在内存中
  updateQueue: mixed, // 存储state更新的队列, 当前节点的state改动之后, 都会创建一个update对象添加到这个队列中.
  memoizedState: any, // 用于输出的state, 最终渲染所使用的state
  dependencies: Dependencies | null, // 该fiber节点所依赖的(contexts, events)等
  mode: TypeOfMode, // 二进制位Bitfield,继承至父节点,影响本fiber节点及其子树中所有节点. 与react应用的运行模式有关(有ConcurrentMode, BlockingMode, NoMode等选项).

  // Effect 副作用相关
  flags: Flags, // 标志位
  subtreeFlags: Flags, //替代16.x版本中的 firstEffect, nextEffect. 当设置了 enableNewReconciler=true才会启用
  deletions: Array<Fiber> | null, // 存储将要被删除的子节点. 当设置了 enableNewReconciler=true才会启用

  nextEffect: Fiber | null, // 单向链表, 指向下一个有副作用的fiber节点
  firstEffect: Fiber | null, // 指向副作用链表中的第一个fiber节点
  lastEffect: Fiber | null, // 指向副作用链表中的最后一个fiber节点

  // 优先级相关
  lanes: Lanes, // 本fiber节点的优先级
  childLanes: Lanes, // 子节点的优先级
  alternate: Fiber | null, // 指向内存中的另一个fiber, 每个被更新过fiber节点在内存中都是成对出现(current和workInProgress)

  // 性能统计相关(开启enableProfilerTimer后才会统计)
  // react-dev-tool会根据这些时间统计来评估性能
  actualDuration?: number, // 本次更新过程, 本节点以及子树所消耗的总时间
  actualStartTime?: number, // 标记本fiber节点开始构建的时间
  selfBaseDuration?: number, // 用于最近一次生成本fiber节点所消耗的时间
  treeBaseDuration?: number, // 生成子树所消耗的时间的总和
|};
```

属性解释:

- `fiber.tag`: 表示 fiber 类型, 根据`ReactElement`组件的 type 进行生成, 在 react 内部共定义了[25 种 tag](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactWorkTags.js#L10-L35).
- `fiber.key`: 和`ReactElement`组件的 key 一致.
- `fiber.elementType`: 一般来讲和`ReactElement`组件的 type 一致
- `fiber.type`: 一般来讲和`fiber.elementType`一致. 一些特殊情形下, 比如在开发环境下为了兼容热更新(`HotReloading`), 会对`function, class, ForwardRef`类型的`ReactElement`做一定的处理, 这种情况会区别于`fiber.elementType`, 具体赋值关系可以查看[源文件](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiber.old.js#L571-L574).
- `fiber.stateNode`: 与`fiber`关联的局部状态节点(比如: `HostComponent`类型指向与`fiber`节点对应的 dom 节点; 根节点`fiber.stateNode`指向的是`FiberRoot`; class 类型节点其`stateNode`指向的是 class 实例).
- `fiber.return`: 指向父节点.
- `fiber.child`: 指向第一个子节点.
- `fiber.sibling`: 指向下一个兄弟节点.
- `fiber.index`: fiber 在兄弟节点中的索引, 如果是单节点默认为 0.
- `fiber.ref`: 指向在`ReactElement`组件上设置的 ref(`string`类型的`ref`除外, 这种类型的`ref`已经不推荐使用, `reconciler`阶段会`将string`类型的`ref`转换成一个`function`类型).
- `fiber.pendingProps`: 输入属性, 从`ReactElement`对象传入的 props. 用于和`fiber.memoizedProps`比较可以得出属性是否变动.
- `fiber.memoizedProps`: 上一次生成子节点时用到的属性, 生成子节点之后保持在内存中. 向下生成子节点之前叫做`pendingProps`, 生成子节点之后会把`pendingProps`赋值给`memoizedProps`用于下一次比较.`pendingProps`和`memoizedProps`比较可以得出属性是否变动.
- `fiber.updateQueue`: 存储`update更新对象`的队列, 每一次发起更新, 都需要在该队列上创建一个`update对象`.
- `fiber.memoizedState`: 上一次生成子节点之后保持在内存中的局部状态.
- `fiber.dependencies`: 该 fiber 节点所依赖的(contexts, events)等, 在`context`机制章节详细说明.
- `fiber.mode`: 二进制位 Bitfield,继承至父节点,影响本 fiber 节点及其子树中所有节点. 与 react 应用的运行模式有关(有 ConcurrentMode, BlockingMode, NoMode 等选项).
- `fiber.flags`: 标志位, 副作用标记(在 16.x 版本中叫做`effectTag`, 相应[pr](https://github.com/facebook/react/pull/19755)), 在[`ReactFiberFlags.js`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberFlags.js#L10-L41)中定义了所有的标志位. `reconciler`阶段会将所有拥有`flags`标记的节点添加到副作用链表中, 等待 commit 阶段的处理.
- `fiber.subtreeFlags`: 替代 16.x 版本中的 firstEffect, nextEffect. 默认未开启, 当设置了[enableNewReconciler=true](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactFeatureFlags.js#L93) 才会启用, 本系列只跟踪稳定版的代码, 未来版本不会深入解读, [使用示例见源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L690-L714).
- `fiber.deletions`: 存储将要被删除的子节点. 默认未开启, 当设置了[enableNewReconciler=true](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactFeatureFlags.js#L93) 才会启用, 本系列只跟踪稳定版的代码, 未来版本不会深入解读, [使用示例见源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactChildFiber.new.js#L275-L287).
- `fiber.nextEffect`: 单向链表, 指向下一个有副作用的 fiber 节点.
- `fiber.firstEffect`: 指向副作用链表中的第一个 fiber 节点.
- `fiber.lastEffect`: 指向副作用链表中的最后一个 fiber 节点.
- `fiber.lanes`: 本 fiber 节点所属的优先级, 创建 fiber 的时候设置.
- `fiber.childLanes`: 子节点所属的优先级.
- `fiber.alternate`: 指向内存中的另一个 fiber, 每个被更新过 fiber 节点在内存中都是成对出现(current 和 workInProgress)

通过以上 25 个属性的解释, 对`fiber`对象有一个初步的认识.

最后绘制一颗 fiber 树与上文中的`ReactElement`树对照起来:

![](/static/assets/react/reactelement-tree.png)
![](/static/assets/react/fiber-tree.png)


注意:

- 这里的`fiber`树只是为了和上文中的`ReactElement`树对照, 所以只用观察红色虚线框内的节点. 
- 其中`<App/>`,`<Content/>`为`ClassComponent`类型的`fiber`节点, 其余节点都是普通`HostComponent`类型节点.
- `<Content/>`的子节点在`ReactElement`树中是`React.Fragment`, 但是在`fiber`树中`React.Fragment`并没有与之对应的`fiber`节点(`reconciler`阶段对此类型节点做了单独处理, 所以`ReactElement`节点和`fiber`节点不是一对一匹配).

### Update 与 UpdateQueue 对象

在`fiber`对象中有一个属性`fiber.updateQueue`, 是一个链式队列(即使用链表实现的队列存储结构), 后文会根据场景表述成链表或队列.

首先观察`Update`对象的数据结构([对照源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactUpdateQueue.old.js#L106-L129)):

```js
export type Update<State> = {|
  eventTime: number, // 发起update事件的时间(17.0.2中作为临时字段, 即将移出)
  lane: Lane, // update所属的优先级

  tag: 0 | 1 | 2 | 3, //
  payload: any, // 载荷, 根据场景可以设置成一个回调函数或者对象
  callback: (() => mixed) | null, // 回调函数

  next: Update<State> | null, // 指向链表中的下一个, 由于UpdateQueue是一个环形链表, 最后一个update.next指向第一个update对象
|};

// =============== UpdateQueue ==============
type SharedQueue<State> = {|
  pending: Update<State> | null,
|};

export type UpdateQueue<State> = {|
  baseState: State,
  firstBaseUpdate: Update<State> | null,
  lastBaseUpdate: Update<State> | null,
  shared: SharedQueue<State>,
  effects: Array<Update<State>> | null,
|};
```

属性解释:

1. `UpdateQueue`

   - `baseState`: 表示此队列的基础 state
   - `firstBaseUpdate`: 指向基础队列的队首
   - `lastBaseUpdate`: 指向基础队列的队尾
   - `shared`: 共享队列
   - `effects`: 用于保存有`callback`回调函数的 update 对象, 在`commit`之后, 会依次调用这里的回调函数.

2. `SharedQueue`

   - `pending`: 指向即将输入的`update`队列. 在`class`组件中调用`setState()`之后, 会将新的 update 对象添加到这个队列中来.

3. `Update`
   - `eventTime`: 发起`update`事件的时间(17.0.2 中作为临时字段, 即将移出)
   - `lane`: `update`所属的优先级
   - `tag`: 表示`update`种类, 共 4 种. [`UpdateState,ReplaceState,ForceUpdate,CaptureUpdate`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactUpdateQueue.old.js#L131-L134)
   - `payload`: 载荷, `update`对象真正需要更新的数据, 可以设置成一个回调函数或者对象.
   - `callback`: 回调函数. `commit`完成之后会调用.
   - `next`: 指向链表中的下一个, 由于`UpdateQueue`是一个环形链表, 最后一个`update.next`指向第一个`update`对象.

`updateQueue`是`fiber`对象的一个属性, 所以不能脱离`fiber`存在. 它们之间数据结构和引用关系如下:

![](/static/assets/react/updatequeue.png)

注意:

- 此处只是展示数据结构和引用关系.对于`updateQueue`在更新阶段的实际作用和运行逻辑, 会在状态组件(class 与 function)章节中详细解读.

### Hook 对象

`Hook`用于`function`组件中, 能够保持`function`组件的状态(与`class`组件中的`state`在性质上是相同的, 都是为了保持组件的状态).在`react@16.8`以后, 官方开始推荐使用`Hook`语法, 常用的 api 有`useState`,`useEffect`,`useCallback`等, 官方一共定义了[14 种`Hook`类型](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.old.js#L111-L125).

这些 api 背后都会创建一个`Hook`对象, 先观察[`Hook`对象的数据结构](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.old.js#L134-L140):

```js
export type Hook = {|
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null,
  next: Hook | null,
|};

type Update<S, A> = {|
  lane: Lane,
  action: A,
  eagerReducer: ((S, A) => S) | null,
  eagerState: S | null,
  next: Update<S, A>,
  priority?: ReactPriorityLevel,
|};

type UpdateQueue<S, A> = {|
  pending: Update<S, A> | null,
  dispatch: (A => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
|};
```

属性解释:

1. `Hook`

- `memoizedState`: 内存状态, 用于输出成最终的`fiber`树
- `baseState`: 基础状态, 当`Hook.queue`更新过后, `baseState`也会更新.
- `baseQueue`: 基础状态队列, 在`reconciler`阶段会辅助状态合并.
- `queue`: 指向一个`Update`队列
- `next`: 指向该`function`组件的下一个`Hook`对象, 使得多个`Hook`之间也构成了一个链表.

2. `Hook.queue`和 `Hook.baseQueue`(即`UpdateQueue`和`Update`）是为了保证`Hook`对象能够顺利更新, 与上文`fiber.updateQueue`中的`UpdateQueue和Update`是不一样的(且它们在不同的文件), 其逻辑会在状态组件(class 与 function)章节中详细解读.

`Hook`与`fiber`的关系:

在`fiber`对象中有一个属性`fiber.memoizedState`指向`fiber`节点的内存状态. 在`function`类型的组件中, `fiber.memoizedState`就指向`Hook`队列(`Hook`队列保存了`function`类型的组件状态).

所以`Hook`也不能脱离`fiber`而存在, 它们之间的引用关系如下:

![](/static/assets/react/fiber-hook.png)

注意:

- 此处只是展示数据结构和引用关系.对于`Hook`在运行时的实际作用和逻辑, 会在状态组件(class 与 function)章节中详细解读.

### scheduler 包

`scheduler`包负责调度, 在内部维护一个任务队列([taskQueue](https://github.com/facebook/react/blob/v17.0.2/packages/scheduler/src/Scheduler.js#L63)). 这个队列是一个最小堆数组, 其中存储了 task 对象.
### Task 对象

`scheduler`包中, 没有为 task 对象定义 type, 其[定义是直接在 js 代码](https://github.com/facebook/react/blob/v17.0.2/packages/scheduler/src/Scheduler.js#L316-L326)中:

```js
var newTask = {
  id: taskIdCounter++,
  callback,
  priorityLevel,
  startTime,
  expirationTime,
  sortIndex: -1,
};
```

属性解释:

- `id`: 位移标识
- `callback`: task 最核心的字段, 指向`react-reconciler`包所提供的回调函数.
- `priorityLevel`: 优先级
- `startTime`: 一个时间戳,代表 task 的开始时间(创建时间 + 延时时间).
- `expirationTime`: 过期时间.
- `sortIndex`: 控制 task 在队列中的次序, 值越小的越靠前.

注意`task`中没有`next`属性, 它不是一个链表, 其顺序是通过堆排序来实现的(小顶堆数组, 始终保证数组中的第一个`task`对象优先级最高).

![](/static/assets/react/taskqueue.png)


---
转载自 [图解 React 源码系列](https://github.com/7kms/react-illustration-series)