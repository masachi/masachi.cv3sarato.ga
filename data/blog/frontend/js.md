---
title: JavaScript
lastmod: '2022-03-03'
date: '2022-03-03'
tags: ['总结', '摸鱼', '前端', '面试']
draft: true
summary:
---

# JavaScript

## ES6

- let 声明变量
- const 声明常量 同时不能修改

### var let const 区别

    1. let 和 const 不存在变量提升，需要先定义
    2. let 和 const 不能重复声明
    3. let 和 const 不会挂载window上
    4. let 和 const 出现在代码块中 会使代码块变为块级作用域

### ES6 新增方法

    数组新增方法：flat、find、findIndex
    对象新增方法：
    Object.assign() Object.values() Object.keys() Object.create()

### 箭头函数

    箭头函数与普通函数的区别：
    1. 箭头函数是匿名函数，不能作为构造函数，不能使用new
    2. 箭头函数没有原型属性
    3. this 指向不同，箭头函数的 this 是定义时所在的对象，普通函数看前面有没有.,点前面是谁 this 就是谁,没有.就是 window
    4. 不可以使用 arguments 对象，该对象在函数体内不存在。

### 基本数据类型

- Number 数字
- String 字符串
- Boolean true/false
- Null
- undefined
- object (function, array, date ...)
- symbol
- bigInt (Chrome 67) 大数

#### 对象存储过程

    1. 开辟一个空间地址
    2. 把键值对存储到这个空间地址的堆内存中
    3. 把这个对象指针赋值给变量名

#### 引用类型小习题

```
let a = 3;
let b = new Number(3);
let c = 3;
console.log(a == b);
console.log(a === b);
console.log(b === c);

true false false
//=========================
const a = {};
const b = { key: "b" };
const c = { key: "c" };
a[b] = 123;
a[c] = 456;
console.log(a[b]);

456  因为object 不能作为key，所以他做key的时候都是toString之后的[object Object] 做key
```

```
基本数据类型与引用数据类型的区别：基本数据类型是操作值,引用数据类型操作的是堆内存空间地址
```

```
布尔值转换: 0 NaN '' null undefined 转化成布尔值是false，其余的都是true
检验有效数字的方法：isNaN
```

```
常用的数据类型检测方式:
typeof
constructor
instanceof
Object.prototype.toString.call()
```
