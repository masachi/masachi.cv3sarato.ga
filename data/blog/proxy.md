---
title: 代理服务
date: '2022-02-11'
tags: ['代理', '摸鱼']
draft: false
summary: 关于现有存在的GFW相关知识以及TG相关网络部署
---

### 代理相关

目前开源代理的实现方案有几种:V2Ray，trojan，Xray，shadowsocks
##### Shadowsocks
shadowsocks 在前几年相对流行，由breakwall开发，最初是C++的 shadowsocks-libev，现在被port到了有golang以及python版本，现在仍然有部分人使用。由于之前坊间传言说GFW已经对ss相关协议有一定的学习了解，因此从v2ray稳定之后很少有人使用原版的ss了
##### V2Ray
V2ray是在ss的作者被请去喝茶之后出现的，现在更新到v4.43，使用人数较多，同时文档也较为详尽。然而配置对于新手来说较为不友好。其通过UUID以及email字符串标识具体使用者
#### Xray
Xray是一个基于V2Ray开发的一个分支项目，XRay支持XTLS，据说XTLS可能为下一代TLS，目前据我所了解的，XTLS目前不稳定，可能更易受到GFW探测。
#### Trojan
Trojan 是基于TLS伪装的一种代理 然而初期版本的trojan 已经有1年不维护了


目前采用V2Ray来跨过本不存在的某些东西，具体文档在其官方文档中有实现，此处仅记录
本文档中采用的方案为WebSocket + TLS，可以用nginx或者haproxy来作证书验证
haproxy样例
```
# V2ray 域名
# acl v2ray_host hdr(host) -i domain
# V2ray Websocket
acl hdr_connection_upgrade hdr(Connection) -i upgrade
acl hdr_upgrade_websocket  hdr(Upgrade)    -i websocket
acl websocket_path path -i path
use_backend v2ray if websocket_path hdr_connection_upgrade hdr_upgrade_websocket
```
同时也可使用v2ray自带的tlsSetting来验证，样例如下
```
"streamSettings": {
    "network": "ws",
    "wsSettings": {
        "path": ""
    },
    "security": "tls",
    "tlsSettings": {
    "certificates": [
            {
                "certificateFile": "certificate",
                "keyFile": "key"
            }
        ]
    }
}
```

#### DNS
本文档中采用的方案为一个domain下挂多个DNS提供商，DnsPod、Hurricane、Cloudflare、Aliyun。下挂3个DNS提供商由于国内查询DNS比较慢，因此挂了个DnsPod

需要注意的是Cloudflare仅支持挂载他自己一家 不支持多提供商同时挂载

#### TCP 拥塞控制
本文档中采用的方案为TCP BBR，但是BBR存在一定问题，据dog250 dalao 所说，BBR 在公平性上存在一定问题，他本人修改了部分 [代码](https://github.com/marywangran/tcp-fair-bbr/blob/main/tcp_fairbbr.c)，此代码需要对kernel 打特定的 [patch](https://github.com/masachi/ubuntu-kernel-update/blob/main/kernel.patch)

patch核心内容:
```
--- include/net/inet_connection_sock.h	2021-05-19 16:30:06.000000000 +0800
+++ include/net/inet_connection_sock.h	2021-05-22 11:33:34.898841467 +0800
@@ -134,8 +134,8 @@
	u32			  icsk_probes_tstamp;
	u32			  icsk_user_timeout;
 
-	u64			  icsk_ca_priv[104 / sizeof(u64)];
-#define ICSK_CA_PRIV_SIZE	  sizeof_field(struct inet_connection_sock, icsk_ca_priv)
+	u64			  icsk_ca_priv[112 / sizeof(u64)];
+#define ICSK_CA_PRIV_SIZE        (20 * sizeof(u64))
 };
```
此处patch 目前测试出ICSK_CA_PRIV_SIZE 当为 (20 * sizeof(u64)) 时可行，不排除 19 的可行性 目前得到的结论是 14 不可行，同时 当编译成内核时 暂未验证BBR 与 fair bbr 对网络影响有任何差别

##### MTProto
MTPtoro是telegram为其客户端定制的一套代理，同样有开源实现，本文档中采用 [mtg](https://github.com/9seconds/mtg) 部署至VPS上。
此代理客户端在Telegram中内置，因此可以实现在不使用外部代理的情况下使用Telegram，解决了当手机使用代理服务器时国内应用程序也会通过代理服务器访问的问题

**注意：mtg 设定时请务必使用prefer-ip = "only-ipv4"**
