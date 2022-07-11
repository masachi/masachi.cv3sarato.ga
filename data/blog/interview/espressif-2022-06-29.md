---
title: 2022-06-29 乐鑫面试 记录
date: '2022-07-01'
tags: ['总结', '面试', '复盘']
draft: false
summary: 2022-06-29 乐鑫面试 问题复盘记录
---

## 1. redux 三大原则

- 整个应用只有一个 store
- store 中的数据无法被直接修改
- store 只能通过 reducer 纯函数来修改

## 2. React 为什么不是 class 而是 className

- class 是关键字
- js 会使用 dom.className 获取样式名，跟 js 保持一致

## 3. React setState replaceState

- setState 是修改其中的部分状态，相当于 Object.assign，只是覆盖，不会减少原来的状态；
- replaceState 是完全替换原来的状态，相当于赋值，将原来的 state 替换为另一个对象，如果新状态属性减少，那么 state 中就没有这个状态了。

## 4. Flex 布局 (Flex Order)

控制子组件在 flex 布局中的先后顺序，默认为 0，可以为负，值越大布局越靠后，当值相等时，就根据写的先后顺序进行显示

## 5. Java synchronized

![](https://img-blog.csdnimg.cn/20210720102708922.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjU0NzAxNA==,size_16,color_FFFFFF,t_70#pic_center)

1. 修饰实例方法：作用于当前对象实例加锁，进入同步代码前要获得 当前对象实例的锁
2. 修饰静态方法: 也就是给当前类加锁，会作用于类的所有对象实例 ，进入同步代码前要获得 当前 class 的锁。因为静态成员不属于任何一个实例对象，是类成员（ static 表明这是该类的一个静态资源，不管 new 了多少个对象，只有一份）。所以，如果一个线程 A 调用一个实例对象的非静态 synchronized 方法，而线程 B 需要调用这个实例对象所属类的静态 synchronized 方法，是允许的，不会发生互斥现象，因为访问静态 synchronized 方法占用的锁是当前类的锁，而访问非静态 synchronized 方法占用的锁是当前实例对象锁。
3. 指定加锁对象，对给定对象/类加锁。synchronized(this|object) 表示进入同步代码库前要获得给定对象的锁。synchronized(类.class) 表示进入同步代码前要获得 当前 class 的锁

总结：

- synchronized 关键字加到 static 静态方法和 synchronized(class) 代码块上都是是给 Class 类上锁。
- synchronized 关键字加到实例方法上是给对象实例上锁。
- 尽量不要使用 synchronized(String a) 因为 JVM 中，字符串常量池具有缓存功能

#### synchronized 本身具备的特性

- 可重入性：synchronized 锁对象的时候有个计数器，他会记录下线程获取锁的次数，在执行完对应的代码块之后，计数器就会-1，直到计数器清零，就释放锁了。可以避免一些死锁的情况。

- 不可中断性： 不可中断就是指，一个线程获取锁之后，另外一个线程处于阻塞或者等待状态，前一个不释放，后一个也一直会阻塞或者等待，不可以被中断。值得一提的是，Lock 的 tryLock 方法是可以被中断的。

## 6. Java volatile

volatile 是 Java 虚拟机提供的轻量级的同步机制，它有３个特性：

- 保证可见性
- 不保证原子性
- 禁止指令重排

## 7. Java super 方法

- 当子类与父类有同名的属性时，可以通过 super。属性的方式调用父类中生命的属性。

- 当子类重写父类的方法后，在子类中若想调用父类中被重写的方法时，需用 super.的方法

- super 修饰构造器，通过在子类中使用 super 列表参数的形式调用父类中制定的构造器
  1. 在构造器内部，super（参数列表）必须声明在首行
  2. 在构造器内部，this（参数列表）或 super（参数列表）只能出现一个
  3. 当构造器中不显示的调用 this（参数列表）或 super（参数列表）默认调用父类中的空参构造器

## 8. Java HashMap 和 HashTable 的区别

## 9. Java TCP UDP 开发

## 10. Kotlin 代理

## 11. Kotlin 协程
