# Mac Linux Clash.Verge配置

## 客户端

[Github's Clash.Verge](https://github.com/zzzgydi/clash-verge) Release 页面下载客户端

> 暂时上不去Github请使用（不保证为最新）

- Linux：[Deb](clash-verge_1.3.7_amd64.deb)

- Mac: [Arm](/static/files/Clash.Verge_1.3.7_aarch64.dmg)  [Intel](/static/files/Clash.Verge_1.3.7_x64.dmg)


## 配置

> 以下皆使用Windows客户端 Clash.Verge 作为样例 由于是同一套基于Tauri框架实现的客户端 理论上各平台的界面以及设置是一样的

### 界面语言

点击 ```Settings```, 并拖动到下面寻找 ```Language```，可设置为中文

![](/static/assets/clash/language.png)

### 内核设置

寻找到 ```Clash内核```，请保证内核一定为 v(version) Meta，由于本教程所对应的Server Config，仅有Meta内核支持，所以请务必保证选相关为Meta内核。若不是Meta，请 点击 ```齿轮样图标``` 修改为Meta内核


![](/static/assets/clash/kernel.png)


### 服务器设置

- 点击 ```配置``` 菜单，并于上方输入框中输入对应的url，随后点击导入，即可看到在配置页面中有存在一项
- 如果无法通过url来导入，请先行通过浏览器访问并下载 ```config yaml```文件，再通过新建 选择本地文件来创建
- 经由本地文件创建的config，建议在测试连接成功之后重新通过url导入一份 或者 通过新建 选择 ```Remote File``` 来保证Config永远是最新的
- 随后转至 ```代理``` 即可看到多条服务器，深色的为选中的 默认对外 Socks5 端口是 7890

![](/static/assets/clash/server.png)


> 上述提及的Url为服务提供商给出的Url，服务提供商一般会给出全量配置文件，请不要随意粘贴Url