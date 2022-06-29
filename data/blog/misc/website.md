---
title: 网站创建从0到1-准备
date: '2022-06-09'
tags: ['摸鱼', '网站创建']
draft: false
summary: 网站创建从0到1-准备
---

### Domain

市面上有免费的 domain 和收费的 domain，无论什么 domain 都分为需要备案 以及 不需要备案。

##### 收费域名

如果说需要买备案的 domain，一般来说到[阿里云](https://mi.aliyun.com/)买就行

如果说需要买不用备案的 domain，像是到[NameCheap](https://www.namecheap.com/)或者是[Google Domain](https://domains.google/) 买，然后一般来说这类域名仅支持信用卡付款

#### 免费域名

这里仅给出一个申请免费域名的网站,[Freenom](https://freenom.com/)，我的 domain 就是这里申请的，或者可以申请 [Eu.org](https://nic.eu.org/)

### DNS 以及 CDN 服务

国内的 DNS 服务 有[DNSPod](https://www.dnspod.cn/), [阿里云 DNS](https://www.aliyun.com/product/dns), 免费的服务就足够使用了
国外的 DNS 服务目前我在用的是[HE](https://dns.he.net/)，他这个据说是相对稳定的 DNS 服务

还有一个 DNS 服务提供商[CloudFlare](https://www.cloudflare.com/)，这个服务提供商同时提供 DNS 与 CDN， 但是他的 DNS 不能与其他 DNS 提供商共存，如果说有强 CDN 需求的可以使用这个

### Vercel

一个免费的静态页面部署提供商，可以部署静态页面，也支持 Edge Function (边缘计算)，如果说仅仅是前端静态页面 可以直接使用这个，并不用买服务器来部署页面

### Heroku

一个免费的 SaaS 提供商，可以部署任意服务，服务存储限制 500MB，免费账户在未绑定信用卡下的免费时间好像有 500+小时/month，绑定信用卡后好像有免费 1K+小时/month，轻量级应用完全可以胜任

### CI & CD

// TODO
