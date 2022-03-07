---
title: 开发原则&规则&定律
lastmod: '2022-03-07'
date: '2022-03-07'
tags: ['总结', '摸鱼']
draft: false
summary: 开发原则以及其他一些定律规律总结，原文地址： https://github.com/nusr/hacker-laws-zh
---

### 90-9-1 法则 (90–9–1 Principle or 1% Rule)

- [英文维基百科](https://en.wikipedia.org/wiki/1%25_rule_(Internet_culture))
- [中文维基百科](https://zh.wikipedia.org/wiki/1%25%E6%B3%95%E5%88%99)

90-9-1 法则表明，在诸如维基这样的互联网社区中，90% 的用户只看内容并不参与互动，9% 的用户会参与讨论，而只有 1% 的用户会创造内容。

> ## **所以会看到很多网站 特别是国内网站 信息内容都是一样的，翻来覆去都是这点内容，因为没多少人创造内容**
---


### 阿姆达尔定律 (Amdahl's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Amdahl%27s_law)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E9%98%BF%E5%A7%86%E8%BE%BE%E5%B0%94%E5%AE%9A%E5%BE%8B)

> 阿姆达尔定律是一个显示计算任务**潜在加速**能力的公式。这种能力可以通过增加系统资源来实现，通常用于并行计算中。它可以预测增加处理器数量的实际好处，然而增加处理器数量会受到程序并行性的限制。

举例说明：如果程序由 A、B 两个部分组成，A 部分必须由单个处理器执行，B 部分可以并行运行。那么向执行程序的系统添加多个处理器只能获得有限的好处。它可以极大地提升 B 部分的运行速度，但 A 部分的运行速度将保持不变。

下图展示了一些运行速度的提升潜能的例子：

![阿姆达尔定律](/static/assets/amdahls_law.png)

_(图片来源：By Daniels220 at English Wikipedia, Creative Commons Attribution-Share Alike 3.0 Unported, https://en.wikipedia.org/wiki/File:AmdahlsLaw.svg)_

可以看出，50％ 并行化的程序在使用大于 10 个处理单元之后的速度提升收效甚微，而 95％ 并行化的程序在使用超过一千个处理单元之后仍然可以显著提升速度。

随着[摩尔定律](#%E6%91%A9%E5%B0%94%E5%AE%9A%E5%BE%8B-moores-law)减慢，单个处理器的速度增加缓慢，并行化是提高性能的关键。图形编程是一个极好的例子，现代着色器可以并行渲染单个像素或片段。这也是现代显卡通常具有数千个处理核心（GPU 或着色器单元）的原因。

参见：

- [布鲁克斯法则](#%E5%B8%83%E9%B2%81%E5%85%8B%E6%96%AF%E6%B3%95%E5%88%99-brookss-law)
- [摩尔定律](#%E6%91%A9%E5%B0%94%E5%AE%9A%E5%BE%8B-moores-law)

> ## **系统运行遇到瓶颈？ 加机器！加机器！**
---

### 破窗效应 (The Broken Windows Theory)

- [英文维基百科](https://en.wikipedia.org/wiki/Broken_windows_theory)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E7%A0%B4%E7%AA%97%E6%95%88%E5%BA%94)

在破窗理论中认为，一些明显的犯罪迹象(或缺乏环保意识)会导致进一步的、更严重的犯罪(或环境的进一步恶化)。

破窗理论已应用于软件开发中，它表明劣质代码(或 [Technical Debt](#TODO))可能会影响后续优化的效率，从而进一步造成代码劣化；随着时间的推移，这种效应将会导致代码质量大幅下降。

参见：

- [Technical Debt](#TODO)

例子：

- [《程序员修炼之道：软件熵》(The Pragmatic Programming: Software Entropy)](https://pragprog.com/the-pragmatic-programmer/extracts/software-entropy)
- [《Coding Horror：破窗效应》(Coding Horror: The Broken Window Theory)](https://blog.codinghorror.com/the-broken-window-theory/)
- [《开源：编程之乐 - 破窗效应》(OpenSource: Joy of Programming - The Broken Window Theory)](https://opensourceforu.com/2011/05/joy-of-programming-broken-window-theory/)


> ## **随便吧，又不是不能用.....**
---

### 布鲁克斯法则 (Brooks's Law)

- [英文维基百科](https://en.m.wikipedia.org/wiki/Brooks%27s_law)

> 软件开发后期，添加人力只会使项目开发得更慢。

这个定律表明，在许多情况下，试图通过增加人力来加速已延期项目的交付，将会使项目交付得更晚。布鲁克斯也明白，这是一种过度简化。但一般的论据是，新资源的时间增加和通信开销，会在短期内使开发速度减慢。而且，许多任务是密不可分的，换句话说，这样可以使更多的资源之间能轻易分配，这也意味着潜在的速度增长也更低。

谚语 **九个女人不能在一个月内生一个孩子** 与布鲁克斯法则同出一辙，特别是某些不可分割或者并行的工作。

这是[《人月神话》](#%E9%98%85%E8%AF%BB%E6%B8%85%E5%8D%95)的中心主题。

参见：

- [Death March](#todo)
- [阅读清单：《人月神话》](#%E9%98%85%E8%AF%BB%E6%B8%85%E5%8D%95)

> ## **人越多 摸鱼的人越多**
---

### 坎宁汉姆定律 (Cunningham's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Ward_Cunningham#Cunningham's_Law)

> 在网络上想得到正确答案的最好方法不是提问题，而是发布一个错误的答案。

据史蒂芬·麦克基迪说，沃德·坎宁汉姆早在 20 世纪 80 年代早期的时候建议他，在互联网上获得正确答案的最好方法不是提问题，而是发布一个错误的答案。麦克基迪称这为坎宁汉姆定律，而坎宁汉姆不以为然，并觉得这是“错误的引用”。最初这条定律只是用于描述 Usenet 上的社交行为，但后来也渐渐用于其他的在线社区（如 Wikipedia、Reddit、Twitter、Facebook 等）。

参见：

- [XKCD 386: "Duty Calls"](https://xkcd.com/386/)

> ## **PHP是世界上最好的语言(大雾)**
---

### 邓宁-克鲁格效应 (The Dunning-Kruger Effect)

- [英文维基百科](https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E9%84%A7%E5%AF%A7-%E5%85%8B%E9%AD%AF%E6%A0%BC%E6%95%88%E6%87%89)

> 无能的人往往不会意识到自己的无能。而得出正确答案所需要的技能，正是你认识到何为正确答案所需要的技能。
>
> ([大卫·邓宁 (David Dunning)](https://en.wikipedia.org/wiki/David_Dunning))

邓宁-克鲁格效应是一种理论上的认知偏差，大卫·邓宁和贾斯汀·克鲁格在 1999 年的一项心理学研究和论文中对此进行了描述。研究表明，在一项任务中能力水平较低的人会更容易高估自己的能力。之所以会产生这种偏向，是因为一个人对问题或领域的复杂性有足够的*认识*时，才能够针对自己在该领域的工作能力提出明智的意见。

邓宁-克鲁格效应也有另一个类似的，更显式的描述，即“一个人对某个领域的了解越少，他就越容易轻视这个领域的难度，从而更倾向于相信自己可以轻易地解决该领域的问题”。该效应与技术高度相关，具体表现为不太熟悉某个领域的个人(如非技术团队成员或经验较少的团队成员)会更有可能低估解决该领域问题所需的工作量。

随着对某一领域的理解和经验的增长，人们很可能会遇到另一种效应-[虚幻的优越性 (Illusory superiority)](https://en.wikipedia.org/wiki/Illusory_superiority)，即特定领域内的丰富经验使得他们更容易高估他人的能力，或低估自己的能力。总而言之，这些影响都归咎于认知偏差。当意识到偏差存在时，我们可以尽量提出意见来消除这些偏差，这样往往可以避免异议。

真实案例:

* [苹果公司 vs 联邦调查局：为什么这个反恐鹰派改变了立场 (Apple vs. FBI: Why This Anti-Terror Hawk Switched Sides)](https://fortune.com/2016/03/10/apple-fbi-lindsay-graham/) - 2016 年，参议员林赛·格雷厄姆改变了他对苹果在设备加密中创建“后门”的立场。起初，格雷厄姆曾批评苹果公司反对创建“后门”，因为他认为这对调查潜在的恐怖计划是必要的。然而，随着他对这个领域的技术复杂性有了更多的了解，格雷厄姆意识到这比他原先想的要困难很多，并可能会产生严重的负面后果。这便是邓宁-克鲁格效应的真实案例--网络安全专家会更清楚如何利用这样的后门，因为他们对该领域有深刻的理解；而外行人士可能会简单地将设备安全类比于物理上的安全，执法时可以使用“万能钥匙”，但这显然与网络安全中的现代加密不可同日而语。

> ## **我好菜啊**
---

### 盖尔定律 (Gall's Law)

- [英文维基百科](<https://en.wikipedia.org/wiki/John_Gall_(author)#Gall's_law>)

> 一个切实可行的复杂系统势必是从一个切实可行的简单系统发展而来的。从头开始设计的复杂系统根本不切实可行，无法修修补补让它切实可行。你必须由一个切实可行的简单系统重新开始。
>
> [约翰·盖尔](<https://en.wikipedia.org/wiki/John_Gall_(author)>) (John Gall)

盖尔定律说明了设计高度复杂的系统很可能会失败。它们很难一蹴而就，更多是从简单的系统逐渐演变而来。

最典型的例子便是互联网。如今的互联网是一个高度复杂的系统，而它最早只是被定义为一种在学术机构之间共享内容的方式。互联网成功实现了最初的目标，并且随着时间不断演化，最终成就了如今的复杂繁荣。

参见：

- [KISS 原则 (保持简单和直白)](#kiss-%e5%8e%9f%e5%88%99-the-kiss-principle)

> ## **不急.jpg**
---

### 侯世达定律 (Hofstadter's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Hofstadter%27s_law)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E4%BE%AF%E4%B8%96%E8%BE%BE%E5%AE%9A%E5%BE%8B)

> 即使考虑到侯世达定律，它也总是比你预期的要长。
>
> 侯世达 (Douglas Hofstadter)

在估计需要多长时间开发时，你可能会听到此定律。软件开发似乎有这样一条定理，即我们往往不能准确地估计需要多长时间才能完成。

语出[《哥德尔、艾舍尔、巴赫：集异璧之大成》](#%E9%98%85%E8%AF%BB%E6%B8%85%E5%8D%95)。

参见：

- [阅读清单：《哥德尔、艾舍尔、巴赫：集异璧之大成》](#%E9%98%85%E8%AF%BB%E6%B8%85%E5%8D%95)

> ## **谁知道会出什么幺蛾子， 艹。飞龙骑脸也会输**
---

### 哈特伯定律 (Hutber's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Hutber%27s_law)

> 改善即恶化。
>
> [帕特里克·哈特伯](https://en.wikipedia.org/wiki/Patrick_Hutber) (Patrick Hutber)

这个定律说明了对一个系统的改进会导致其他部分的恶化；或者它会将其他的恶化隐藏起来，并导致系统整体状态的退化。

例如，某个端点的响应延迟减少，就可能导致请求流中的吞吐量和容量问题进一步增加，并影响到另一个完全不同的子系统。

> ## **谁知道改了这里那里会出问题.jpg**
---

### 技术成熟度曲线 (The Hype Cycle or Amara's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Hype_cycle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E6%8A%80%E6%9C%AF%E6%88%90%E7%86%9F%E5%BA%A6%E6%9B%B2%E7%BA%BF)

> 我们倾向于过高估计技术在短期内的影响，并低估长期效应。
>
> _罗伊·阿马拉 (Roy Amara)_

技术成熟度曲线是[高德纳咨询公司](https://zh.wikipedia.org/wiki/%E9%AB%98%E5%BE%B7%E7%BA%B3%E5%92%A8%E8%AF%A2%E5%85%AC%E5%8F%B8)对技术最初兴起和发展的视觉展现。一图顶千言：

![The Hype Cycle](/static/assets/gartner_hype_cycle.png)

_(图片来源: By Jeremykemp at English Wikipedia, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=10547051)_

简而言之，这个周期表明，新技术及其潜在影响通常会引发一阵浪潮。团队快速使用这些新技术，有时会对结果感到失望。这可能是因为该技术还不够成熟，或者现实应用还没有完全实现。经过一段时间后，技术的能力提高了，使用它的实际机会会增加，最终团队也可以提高工作效率。罗伊·阿马拉简洁地总结了这一点：我们倾向于高估技术短期内的影响，并低估长期效应。

> ## **等，等等等等**
---
### 林纳斯定律 (Linus's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Linus%27s_law)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E6%9E%97%E7%BA%B3%E6%96%AF%E5%AE%9A%E5%BE%8B)

> 足够多的眼睛，就可让所有问题浮现。
>
> _Eric S. Raymond_

简单地说，能够看到问题的人越多，有人解决过相关的问题或事情的可能性就越高。

最初该定律是用来描述开源模型对于项目的价值的，并适用于任意的软件项目。同时它也可以扩展到开发流程之中——更多的代码审查、更多的静态分析和多重测试可以让问题更加明显和容易识别。

林纳斯定律的一个更正式的说法如下：

> 如果有足够大的测试员和联合开发人员基础，那么几乎每个问题都能很快被特征化，从而让以前遇到过类似问题的人解决。

这条定律最早出现在 Eric S. Raymond 所著书 "[The Cathedral and the Bazaar](https://en.wikipedia.org/wiki/The_Cathedral_and_the_Bazaar)" 中，并以 [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) 的名字命名以作纪念。

> ## **人多力量大**
---

### 摩尔定律 (Moore's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Moore%27s_law)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E6%91%A9%E5%B0%94%E5%AE%9A%E5%BE%8B)

> 集成电路中的晶体管数量大约每两年翻一番。

这条定律通常用于说明半导体和芯片技术提高的绝对速度。从 20 世纪 70 年代到 21 世纪前十年，摩尔的预测被证明是高度准确的。 近年来，这种趋势略有变化，部分原因受到[量子隧穿效应](https://zh.wikipedia.org/wiki/%E9%87%8F%E5%AD%90%E7%A9%BF%E9%9A%A7%E6%95%88%E6%87%89)影响。然而，并行化计算的进步以及半导体技术和量子计算潜在的革命性变化，可能意味着摩尔定律在未来几十年内继续保持正确。
> ## **辣鸡高通 870 yes**
---

### 墨菲定律 (Murphy's Law / Sod's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Murphy%27s_law)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E6%91%A9%E8%8F%B2%E5%AE%9A%E7%90%86)

> 凡是可能出错的事就一定会出错。

出自 [爱德华·A·墨菲](https://en.wikipedia.org/wiki/Edward_A._Murphy_Jr.) ， _墨菲定律_ 说明了如果一件事有可能出错，那么就一定会出错。

这是一句开发人员间的俗语，在开发、测试甚至在生产中都有可能会发生一些令人意想不到的事情。而这一定律也可以参考在英式英语中更为常见的 _索德定理_ ：

> 如果某件事可能出错，那么它一定会在最糟糕的时候发生。

这些定律常常用于幽默嘲弄。但是，类似于 [_Confirmation Bias_](#TODO) 和 [_Selection Bias_](#TODO) 的现象很容易导致人们过分强调这些定律（即在大部分情况下，一件事的成功会显得司空见惯；而失败才会引起更多的注意和讨论）。

参见:

- [Confirmation Bias](#TODO)
- [Selection Bias](#TODO)

> ## **100%**
---

### 奥卡姆剃刀 (Occam's Razor)

- [英文维基百科](https://en.wikipedia.org/wiki/Occam's_razor)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%A5%A5%E5%8D%A1%E5%A7%86%E5%89%83%E5%88%80)

> 如无必要，勿增实体。
>
> 奥卡姆的威廉 (William of Ockham)

奥卡姆剃刀指出，在几种可能的解决方案之中，最有可能的解决方案便是概念和假设最少的那个。因为这个解决方案最为简单，只解决了问题，并且没有引入额外的复杂度和可能的负面后果。

参见：

- [你不需要它原则 (YAGNI)](#%e4%bd%a0%e4%b8%8d%e9%9c%80%e8%a6%81%e5%ae%83%e5%8e%9f%e5%88%99-yagni)
- [没有银弹：软件工程的本质性与附属性工作](https://zh.wikipedia.org/wiki/%E6%B2%A1%E6%9C%89%E9%93%B6%E5%BC%B9)
- [No Silver Bullet: Accidental Complexity and Essential Complexity](https://en.wikipedia.org/wiki/No_Silver_Bullet)

例子：

- [精益软件开发：消除浪费](https://zh.wikipedia.org/wiki/%E7%B2%BE%E7%9B%8A%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91#%E6%B6%88%E9%99%A4%E6%B5%AA%E8%B4%B9)
- [Lean Software Development: Eliminate Waste](https://en.wikipedia.org/wiki/Lean_software_development#Eliminate_waste)

> ## **越简单越好**
---

### 帕金森定理 (Parkinson's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Parkinson%27s_law)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%B8%95%E9%87%91%E6%A3%AE%E5%AE%9A%E7%90%86)

> 在工作能够完成的时限内，工作量会一直增加，直到所有可用时间都被填满为止。

基于官僚机构的研究背景，该定律被应用于软件开发中。该理论认为，团队在截止日期之前效率低下，然后在截止日期前赶紧完成工作，从而使实际截止日期变得随意。

将这个定理与[侯世达定律](#%E4%BE%AF%E4%B8%96%E8%BE%BE%E5%AE%9A%E5%BE%8B-hofstadters-law)相结合，则会获得更加悲观的观点：为了在规定时间内完成工作，工作将增多，花费比预期更长的时间。

参见：

- [侯世达定律](#%E4%BE%AF%E4%B8%96%E8%BE%BE%E5%AE%9A%E5%BE%8B-hofstadters-law)

> ## **活是干不完的，适度摸鱼**
---

### 过早优化效应 (Premature Optimization Effect)

- [英文在线网站](http://wiki.c2.com/?PrematureOptimization)

> 过早优化是万恶之源。
>
> [高德纳 (唐纳德克努特的中文名)](https://twitter.com/realdonaldknuth?lang=en)

在高德纳的[《goto 语句的结构化编程》](http://wiki.c2.com/?StructuredProgrammingWithGoToStatements)论文中，他写到：“程序员们浪费了大量的时间去思考或者担心他们的程序中的非关键部分的速度。而在考虑调试和维护的时候，这些所谓提高效率的做法实际上十分不妥。我们应该放弃小的效率点，并且要在 97% 的时间提醒自己，**过早优化是万恶之源**。而且连那关键的 3% 也不能够放过。”

然而，_过早优化_ （简而言之）可以定义为在我们知道需要做什么之前进行优化。

> ## **优化？ 不存在的**
---

### 得墨忒耳定律 (The Law of Demeter)

- [英文维基百科](https://en.wikipedia.org/wiki/Law_of_Demeter)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%BE%97%E5%A2%A8%E5%BF%92%E8%80%B3%E5%AE%9A%E5%BE%8B)

> 别和陌生人讲话。

得墨忒耳定律又称最少知识原则，是一条与面向对象语言有关的软件设计原则。

该定律表明，软件的一个单元应该只与其直接合作者交谈。比如对象 `A` 引用了对象 `B`，对象 `B` 引用了对象 `C`，则 `A` 可以直接调用 `B` 的方法，但不应直接调用 `C` 的方法。所以如果 `C` 有一个 `dothing()` 的方法，`A` 不应该直接调用，而是使用 `B.getC().doThis()`。

遵循这一定律可以限制代码更改的范围，使其以后更容易维护、更安全。

---

### Unix 哲学 (The Unix Philosophy)

- [英文维基百科](https://en.wikipedia.org/wiki/Unix_philosophy)
- [中文维基百科](https://zh.wikipedia.org/wiki/Unix%E5%93%B2%E5%AD%A6)

Unix 哲学指软件组件应该很小，并专注于做一件特定的事情。将小而简单以及定义良好的单元组合在一起，而不是使用大而复杂的多用途程序，可以更轻松地构建系统。

像**微服务架构**这种现代实践可以认为是这种哲学的应用，其中服务很小，集中于做一件特定的事情，由简单的构建块组成复杂的行为。

---

### 惠顿定律 (Wheaton's Law)

- [网站链接](http://www.wheatonslaw.com/)
- [官方节日](https://dontbeadickday.com/)

> 不要像个傻子一样。
>
> _威尔·惠顿 (Wil Wheaton)_

这条定律由威尔 · 惠顿（曾出演过星际迷航：下一代、生活大爆炸）创造，这个简洁而有力的定律旨在专业组织内营造和谐和尊重的环境。它可以在与同事交谈、代码审查、反驳观点和批评的时候派上用场。而且通常情况下，人们之间的专业交互也同样适用。

---

### 切斯特森围栏 (Chesterson's Fence)

- [英文维基百科](https://en.wikipedia.org/wiki/Wikipedia:Chesterton%27s_fence)

> 在了解现有情况背后的原因之前，不应该进行改进。

该原则与软件工程中的消除技术负债 (Technical debt) 相关。程序的每一行最初都是出于某种原因编写的，因此根据切斯特森围栏原则，在更改或删除代码之前，即使看起来似乎是多余的或不正确的，也应该尝试完全理解代码的上下文和含义。

该原则的名字来源于 [G.K. Chesterson](https://en.wikipedia.org/wiki/G._K._Chesterton) 的一则故事。一个男人横穿马路中央的栅栏，他向市长抱怨这道栅栏没有用还挡路，并要求拆除它。市长问他为什么要在那里建栅栏，那个人回答说不知道。市长接着说：“如果你不知道它的用途，我肯定不会让你把它拆了。你去查查它的用途，之后我可能会允许你拆掉它。”

> ## **别乱改！！！这都是历史遗留问题**
---

### 死海效应 (The Dead Sea Effect)

- [Bruce F. Webster 的博客文章](http://brucefwebster.com/2008/04/11/the-wetware-crisis-the-dead-sea-effect/)

> "... 那些更有才华，更有效率的 IT 工程师最有可能离开——消失 ... （而那些倾向于）留下来的“剩下的人”——是最没有才华和效率的 IT 工程师。"
>
> _Bruce F. Webster_

死海效应表明，在任何一个组织中，工程师的技能、才华和效能往往与他们在公司的时间呈反比。

通常情况下，技术好的工程师很容易在其他的地方找到工作，并且他们往往也会这样做。而技能过时或技术薄弱的工程师则会留在公司，因为其他地方很难找到工作。如果这些工程师在公司里获得了加薪，他们会更愿意留在公司，因为在其他地方找到同等薪酬的工作会很有挑战性。

> ## **辣鸡还是辣鸡**
---

### 呆伯特法则 (The Dilbert Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Dilbert_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%91%86%E4%BC%AF%E7%89%B9%E6%B3%95%E5%89%87)

> 公司会倾向于系统地将工作能力差的员工提升到管理层，以使他们脱离工作流程。
>
> _史考特·亚当斯 (Scott Adams)_

呆伯特原则是由史考特·亚当斯 (Dilbert 漫画连环画的创建者) 开发的一个管理概念，灵感来源于[彼得原理](#%e5%bd%bc%e5%be%97%e5%8e%9f%e7%90%86-the-peter-principle)。根据呆伯特原则，工作能力差的员工会被提升到管理层，从而限制他们所能造成的损害。亚当斯首先在 1995 年《华尔街日报》的一篇文章中解释了这一原则，随后在他 1996 年的商业书籍《呆伯特原则》中进行了扩展。

参见：

- [The Peter Principle](#the-peter-principle)
- [普特定律](#%e6%99%ae%e7%89%b9%e5%ae%9a%e5%be%8b-putts-law)

> ## **我不认为 (这太僵了)**
---

### 彼得原理 (The Peter Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Peter_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%BD%BC%E5%BE%97%E5%8E%9F%E7%90%86)

> 在等级制度中，人往往会被提升到他们的“无法胜任的水平”。
>
> _劳伦斯·彼得 (Laurence J. Peter)_

这是由劳伦斯·彼得提出的一个管理概念。彼得原理认为，擅长工作的人会得到提升，直到他们达到不再成功的水平 (即他们所“无法胜任的水平”)。基于此，由于他们资历更高，被公司开除的可能性较小 (除非他们表现非常糟糕)。而且他们将继续担任几乎没有本职技能的职位，即使那些原本让他们成功的能力在新工作中并无必要。

有的工程师对此特别感兴趣，它们最初从事的是深度的技术工作，但走上了**管理**其他工程师的职业道路——这意味着需要一个完全不同的技能树。

参见：

- [呆伯特法则](#%e5%91%86%e4%bc%af%e7%89%b9%e6%b3%95%e5%88%99)
- [普特定律](#%e6%99%ae%e7%89%b9%e5%ae%9a%e5%be%8b-putts-law)
  
> ## **提升完之后给个低绩效 开掉(狗头)**
---

### 鲁棒性原则 (The Robustness Principle or Postel's Law)

- [英文维基百科](https://en.wikipedia.org/wiki/Robustness_principle)

> 在自己所做的事情上要保守, 在接受别人的事情上要自由。

通常应用于服务器应用程序开发中，该原则指出，你发送给其他人的内容应尽可能最小且符合要求，并且处理不符合要求的输入。

该原则的目标是构建稳健的系统。如果可以理解意图，它们可以处理不良的输入。但是，接受错误格式的输入可能存在安全隐患，特别是此类的输入未经过充分测试。

> ## **能少给就少给，能不传就不传**
---

### SOLID

这是一个缩写，指的是：

- S：[单一功能原则 (The Single Responsibility Principle)](#%E5%8D%95%E4%B8%80%E5%8A%9F%E8%83%BD%E5%8E%9F%E5%88%99-the-single-responsibility-principle)
- O：[开闭原则 (The Open/Closed Principle)](#%E5%BC%80%E9%97%AD%E5%8E%9F%E5%88%99-the-openclosed-principle)
- L：[里氏替换原则 (The Liskov Substitution Principle)](#%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%99-the-liskov-substitution-principle)
- I：[接口隔离原则 (The Interface Segregation Principle)](#%E6%8E%A5%E5%8F%A3%E9%9A%94%E7%A6%BB%E5%8E%9F%E5%88%99-the-interface-segregation-principle)
- D：[依赖反转原则 (The Dependency Inversion Principle)](#%E4%BE%9D%E8%B5%96%E5%8F%8D%E8%BD%AC%E5%8E%9F%E5%88%99-the-dependency-inversion-principle)

这些是 [Object-Oriented Programming](#todo) 的关键原则。诸如此类的设计原则能够帮助开发人员构建更易于维护的系统。

### 单一功能原则 (The Single Responsibility Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Single_responsibility_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%8D%95%E4%B8%80%E5%8A%9F%E8%83%BD%E5%8E%9F%E5%88%99)

> 每个模块或者类只应该有一项功能。

[SOLID](#solid) 的第一个原则。这个原则表明模块或者类只应该做一件事。实际上，这意味着对程序功能的单个小更改，应该只需要更改一个组件。例如，更改密码验证复杂性的方式应该只需要更改程序的一部分。

理论上讲，这使代码更健壮，更容易更改。知道正在更改的组件只有一个功能，这意味着测试更改更容易。使用前面的例子，更改密码复杂性组件应该只影响与密码复杂性相关的功能。变更具有许多功能的组件可能要困难得多。

参见：

- [Object-Orientated Programming](#todo)
- [SOLID](#solid)

---

### 开闭原则 (The Open/Closed Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E5%BC%80%E9%97%AD%E5%8E%9F%E5%88%99)

> 实体应开放扩展并关闭修改。

[SOLID](#solid) 的第二个原则。这个原则指出实体（可以是类、模块、函数等）应该能够使它们的行为易于扩展，但是它们的扩展行为不应该被修改。

举一个假设的例子，想象一个能够将 Markdown 转换为 HTML 的模块。如果可以扩展模块，而不修改内部模块来处理新的 markdown 特征，而无需修改内部模块，则可以认为是开放扩展。如果用户不能修改处理现有 Markdown 特征的模块，那么它被认为是关闭修改。

这个原则与面向对象编程紧密相关，让我们可以设计对象以便于扩展，但是可以避免以意想不到的方式改变其现有对象的行为。

参见：

- [Object-Orientated Programming](#todo)
- [SOLID](#solid)

---

### 里氏替换原则 (The Liskov Substitution Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%99)

> 可以在不破坏系统的情况下，用子类型替换类型。

[SOLID](#solid) 的第三个原则。该原则指出，如果组件依赖于类型，那么它应该能够使用该类型的子类型，而不会导致系统失败或者必须知道该子类型的详细信息。

举个例子，假设我们有一个方法，读取 XML 文档。如果该方法使用基类型 **file**，则从 **file** 派生的任何内容，都能用在该方法中。 如果 **file** 支持反向查找，并且 xml 解析器使用该函数，但是派生类型 **network file** 尝试反向查找时失败，则 **network file** 将违反该原则。

该原则与面向对象编程紧密相关，必须仔细建模、层次结构，以避免让系统用户混淆。

参见：

- [Object-Orientated Programming](#todo)
- [SOLID](#solid)

---

### 接口隔离原则 (The Interface Segregation Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Interface_segregation_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E6%8E%A5%E5%8F%A3%E9%9A%94%E7%A6%BB%E5%8E%9F%E5%88%99)

> 不应强制任何客户端依赖于它不使用的方法。

[SOLID](#solid) 的第四个原则。该原则指出组件的消费者不应该依赖于它实际上不使用的组件函数。

举一个例子，假设我们有一个方法，读取 XML 文档。它只需要读取文件中的字节，向前移动或向后移动。如果由于一个与文件结构不相关的功能发生更改（例如更新文件安全性的权限模型），需要更新此方法，则该原则已失效。文件最好实现 **可查询流** 接口，并让 XML 读取器使用该接口。

该原则与面向对象编程紧密相关，其中接口，层次结构和抽象类型用于不同组件的 [minimise the coupling](#todo)。 [Duck typing](#todo) 是一种通过消除显式接口来强制执行该原则的方法。

参见：

- [Object-Orientated Programming](#todo)
- [SOLID](#solid)
- [Duck Typing](#todo)
- [Decoupling](#todo)

---

### 依赖反转原则 (The Dependency Inversion Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E4%BE%9D%E8%B5%96%E5%8F%8D%E8%BD%AC%E5%8E%9F%E5%88%99)

> 高级模块不应该依赖于低级实现。

[SOLID](#solid) 的第五个原则。该原则指出，更高级别的协调组件不应该知道其依赖项的详细信息。

举个例子，假设我们有一个从网站读取元数据的程序。我们假设主要组件必须知道下载网页内容的组件，以及可以读取元数据的组件。如果我们考虑依赖反转，主要组件将仅依赖于可以获取字节数据的抽象组件，然后是一个能够从字节流中读取元数据的抽象组件，主要组件不需要了解 TCP、IP、HTTP、HTML 等。

这个原则很复杂，因为它似乎可以反转系统的预期依赖性（因此得名）。实践中，这也意味着，单独的编排组件必须确保抽象类型的正确实现被使用（例如在前面的例子中，必须提供元数据读取器组件、HTTP 文件下载功能和 HTML 元标签读取器）。然后，这涉及诸如 [Inversion of Control](#todo) 和 [Dependency Injection](#todo) 之类的模式。

参见：

- [Object-Orientated Programming](#todo)
- [SOLID](#solid)
- [Inversion of Control](#todo)
- [Dependency Injection](#todo)

> ## **我就这样给了，你要怎么用和我没关系**
---

### 不要重复你自己原则 (The DRY Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [中文维基百科](https://zh.wikipedia.org/wiki/%E4%B8%80%E6%AC%A1%E4%B8%94%E4%BB%85%E4%B8%80%E6%AC%A1)

> 系统中，每一块知识都必须是单一、明确而权威的。

DRY 是 **Do not Repeat Yourself** 的缩写。这个原则旨在帮助开发人员减少代码的重复性，并将公共代码保存在一个地方。最初由安德鲁·亨特和戴夫·托马斯在 1999 年出版的《程序员修炼之道》中引用。

> 与 DRY 相反的是 _WET_（功能实现两次或者喜欢打字 Write Everything Twice or We Enjoy Typing）。

实际上，如果你在两个或更多的地方有相同的功能，你可以使用 DRY 原则将它们合并为一个，并在任何你需要的地方重复使用。

参见：

- 《程序员修炼之道》[英文维基百科](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer)
- 《程序员修炼之道》[豆瓣](https://book.douban.com/subject/1417047/)

---

### KISS 原则 (The KISS Principle)

- [英文维基百科](https://en.wikipedia.org/wiki/KISS_principle)
- [中文维基百科](https://zh.wikipedia.org/wiki/KISS%E5%8E%9F%E5%88%99)

> 保持简单和直白。

KISS 原则指明了如果大多数的系统能够保持简单而非复杂化，那么他们便能够工作在最佳状态。因此，简单性应该是设计时的关键指标，同时也要避免不必要的复杂度。这个短语最初出自 1960 年的美国海军飞机工程师凯利 · 约翰逊 (Kelly Johnson)。

这一原则的最好例证便是约翰逊给设计工程师一些实用工具的故事。那时的他们正面临着一个挑战，即他们参与设计的喷气式飞机必须能够让普通的机械师在战场上仅仅用这些工具进行维修，因此，“直白”这个词应指的是损坏的事物本身和修复用工具的复杂度两者之间的关系，而非工程师们自身的能力水平。

参见：

- [盖尔定律](#%e7%9b%96%e5%b0%94%e5%ae%9a%e5%be%8b-galls-law)
  
---

### 你不需要它原则 (YAGNI)

- [英文维基百科](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)

这是 _**Y**ou **A**ren't **G**onna **N**eed **I**t_ 的缩写。

> 只有当你需要某些东西的时候，才去实现它们，而不是在你预见的时候。
>
> [Ron Jeffries](https://twitter.com/RonJeffries) 是极限编程的创始人之一以及书籍《Extreme Programming Installed》的作者。

极限编程原则告诫开发人员，他们应该只实现当前所需的功能，并避免实现未来需要的功能，仅在必要时才实现。

遵守这一原则可以减小代码库大小，同时避免时间和生产力浪费在没有价值的功能上。

参见：

- [阅读清单《极限编程安装》](#%E9%98%85%E8%AF%BB%E6%B8%85%E5%8D%95)