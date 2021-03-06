---
title: 网关对比
date: '2021-11-24'
tags: ['网关', '分享', '总结', '工作']
draft: false
summary: 市面上Gateway的对比以及总结，此处对比了Zuul 1 2、Spring Gateway以及Kong
---



## zuul 1  ZUUL 2  kong  Spring cloud gateway

### zuul 1
zuul1 本质就是个同步servlet，采用多线程阻塞模型，缺点在于当慢服务过多时会把zuul线程池耗尽导致后续进来的请求无法响应，解决方案目前只有加大线程池
但是加大线程池其实就是加机器，所带来的副作用是加机器就是增加预算，还有就是加大线程池不是一个永久的解决方案 仅仅是当前情况下的临时方案

![](https://mmbiz.qpic.cn/mmbiz_png/7xEgl6ic8qHSibfzCNOh7cIEwtUJj9AawVb1iaVxKMxHsicI5DYBSiac2WqPjRdoB8tvXwaxiapicdnJ1UNh8pHd7DH8g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


### zuul 2
zuul2 从zuul1用Blocking IO 实现切换到了用NonBlocking IO， zuul2本质上就是运行在netty上的一套filter
zuul2 通过
zuul2接受到请求之后给到netty，随后执行一系列filter，最后由nettyclient 转发给服务
zuul2的性能据官方所说的比zuul1提高了20%

![](https://img-blog.csdnimg.cn/20200403161310920.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3llamluZ3RhbzcwMw==,size_16,color_FFFFFF,t_70)


#### Zuul 2 Reactor Event Loop
![](https://mmbiz.qpic.cn/mmbiz_png/7xEgl6ic8qHSibfzCNOh7cIEwtUJj9AawVN4cWGXokQhyyTxG8ZxrCXD1KxjiaYo1MIYHxlU6ibIsPicD6a8UNXiaLHg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


#### Zuul 2 动态过滤器
![](https://img-blog.csdnimg.cn/2020040316145521.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3llamluZ3RhbzcwMw==,size_16,color_FFFFFF,t_70)

### Kong
Kong是基于openrusty（nginx-lua）的一套Gateway实现，其主要特性为插件化，公共仓库提供各类插件，同时也可通过Lua脚本来自定义插件
kong的缺点在于没有一个官方提供的GUI或者是Web配置，只有社区提供的web配置或者使用其Admin API进行创建服务映射
同时Kong也不能和Service Discovery 诸如Eureka等 相结合 

### Spring Cloud Gateway
Spring Cloud Gateway (参考：https://www.cnblogs.com/crazymakercircle/p/11704077.html) 基于Spring 5.0， Spring Boot 2.0 等技术开发，与zuul 2 同样采用NIO API实现以及基于Netty

客户端向 Spring Cloud Gateway 发出请求。然后在 Gateway Handler Mapping 中找到与请求相匹配的路由，将其发送到 Gateway Web Handler。Handler 再通过指定的过滤器链来将请求发送到我们实际的服务执行业务逻辑，然后返回。

![](https://upload-images.jianshu.io/upload_images/19816137-dad0e43fc31f4536?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


Predicate
![](https://upload-images.jianshu.io/upload_images/19816137-bb046dbf19bee1b4.gif?imageMogr2/auto-orient/strip)


对于Zuul 1 以阻塞方式 请求目前存在的问题的解决方案有以下几种

1. 改造Zuul 1 AsyncTaskExecutor(参考: )

    此方案改造之后Zuul 实现了前端异步，不足在于当执行的线程池耗尽并且Servlet线程同时耗尽时同样会出现问题

2. 替换成zuul2

    当前方案对于现在架构体系下的代价相对较小的方案。但是其缺点在于Zuul 2 相对于Zuul 1 没有相对完善的文档以及社区 文档可能存在不足的情况 遇到相关问题解决方案较少

3. 替换成Kong

    方案2 的代价极高，需要完全推翻Zuul 1的架构体系

    Kong的优点在于依托openrusty带来的高性能 以及 强大的社区支持，缺点在于 整套架构推翻 代码重写 代价极高，开发人员需要时间学习Lua 并且线上难调试 同时不能接入Eureka等服务发现

4. 替换成Spring Cloud Gateway

    方案3 相较于上述方案 代价相对不高 相较于Zuul 1 性能理论上与Zuul 2 相当，相较于Zuul 2来说，Spring Cloud Gateway 的社区更成熟

以下是上述几种gateway的对比

| 特性 |   Zuul 1   | Zuul 2 | Spring Cloud Gateway | Kong
|:---:|:---:|:---:|:---:|:---:|
|Path注入|可部分实现|可实现|自带|需要自行开发
|host转发|不支持|不自带，可以自己实现|自带支持|自带支持
|动态代码|不支持|可动态通过代码修改filter|不支持|支持
|动态配置|Archaius,Spring|Netflix Archaius|Spring（config+bus+actuator）或自开发|支持
|网关高可用| Load Balance,Eureka|Load Balance,Eureka|Load Balance,Eureka| Kong Cluster + 数据库高可用
|服务发现|eureka|eureka,nacos|eureka，nacos|不支持
|功能扩展|只扩展过滤器|可创建路由规则，过滤规则|路由规则，过滤规则都可扩展 | 可通过插件做扩展
|限流|信号量、线程数|内置限流统计，需要自己封装实现，集群可能需要自开发|引入redis计数，可细化到针对IP做限流，限流规则可自定义|插件支持
|熔断|Hystrix降级|需要基于内置的统计做封装|利用Hystrix|插件支持
|实现方式|Java BIO|Java NIO|Java NIO|Nginx|

### 综上：
若需要对现有的Zuul 1 架构进行替换 个人建议 采用Spring Cloud Gateway

理由

1. 其由Spring团队主导开发 社区以及文档等较为成熟 
2. 实现原理与Zuul 2 相同，使用的都是Reactor线程
3. Spring Cloud Gateway 可接入eureka, nacos等服务发现，保证其高可用性
4. 当前技术栈不产生变化 开发学习成本相对较低
