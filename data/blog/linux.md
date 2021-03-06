---
title: Linux 运维
date: '2022-02-11'
tags: ['Linux', '摸鱼', '分享']
draft: false
summary: 关于Linux 以及网络监控 系统监控相关分享，大部分还是网络监控
---

## 运维相关

### 1. btop

btop 是个 Linux 系统全面监控的小工具 界面十分花哨 默认功能即可满足很多需求 GitHub 地址: [btop](https://github.com/aristocratos/btop)

安装脚本：

```
#! /bin/bash
mkdir btop
cd btop && wget -O btop.tbz https://github.com/aristocratos/btop/releases/latest/download/btop-x86_64-linux-musl.tbz
tar -xjvf btop.tbz
chmod +x install.sh
bash install.sh
```

### 2. vnstat

vnstat 是一款流量监控软件 他可以根据网卡进行监控流量 提供实时速度 小时、日、周、月流量统计 但是不能根据相关设定来分开统计某一用户或者其他方式统计(说到底还是想服务于 v2 然而不行 v2 的流量统计下文详述) 同时其支持粗略预计今日流量情况 从 ISP 后台查看到的数据与其统计数据差别不大 因此有一定的可行度

安装方法： `apt-get install vnstat -y`

命令详情：

```
vnStat 2.6 by Teemu Toivola <tst at iki dot fi>

      -5,  --fiveminutes [limit]   show 5 minutes
      -h,  --hours [limit]         show hours  这里的小时统计显示24小时内的流量统计情况
      -hg, --hoursgraph            show hours graph
      -d,  --days [limit]          show days
      -m,  --months [limit]        show months
      -y,  --years [limit]         show years
      -t,  --top [limit]           show top days

      -b, --begin <date>           set list begin date
      -e, --end <date>             set list end date

      --oneline [mode]             show simple parsable format
      --json [mode] [limit]        show database in json format
      --xml [mode] [limit]         show database in xml format

      -tr, --traffic [time]        calculate traffic
      -l,  --live [mode]           show transfer rate in real time
      -i,  --iface <interface>     select interface (default: ens3)

Use "--longhelp" or "man vnstat" for complete list of options.
```

配置文件样例：

```
# vnStat 2.6 config file
##

# default interface
Interface "ens3"

# location of the database directory
DatabaseDir "/var/lib/vnstat"

# locale (LC_ALL) ("-" = use system locale)
Locale "-"

# date output formats for -d, -m, -t and -w
DayFormat    "%Y-%m-%d"
MonthFormat  "%Y-%m"
TopFormat    "%Y-%m-%d"

# characters used for visuals
RXCharacter       "%"
TXCharacter       ":"
RXHourCharacter   "r"
TXHourCharacter   "t"

# how units are prefixed when traffic is shown
# 0 = IEC standard prefixes (KiB/MiB/GiB...)
# 1 = old style binary prefixes (KB/MB/GB...)
# 2 = SI decimal prefixes (kB/MB/GB...)
UnitMode 1

# used rate unit (0 = bytes, 1 = bits)
RateUnit 0

# how units are prefixed when traffic rate is shown in bits
# 0 = IEC binary prefixes (Kibit/s...)
# 1 = SI decimal prefixes (kbit/s...)
RateUnitMode 1

# output style
# 0 = minimal & narrow, 1 = bar column visible
# 2 = same as 1 except rate in summary
# 3 = rate column visible
OutputStyle 3

# number of decimals to use in outputs
DefaultDecimals 2
HourlyDecimals 1

# spacer for separating hourly sections (0 = none, 1 = '|', 2 = '][', 3 = '[ ]')
HourlySectionStyle 2

# how many seconds should sampling for -tr take by default
Sampletime 5

# default query mode
# 0 = normal, 1 = days, 2 = months, 3 = top, 5 = short
# 7 = hours, 8 = xml, 9 = one line, 10 = json
QueryMode 0

# default list output entry limits (0 = all)
List5Mins      24
ListHours      24
ListDays       30
ListMonths     12
ListYears       0
ListTop        10


# vnstatd
##

# switch to given user when started as root (leave empty to disable)
DaemonUser ""

# switch to given group when started as root (leave empty to disable)
DaemonGroup ""

# try to detect interface maximum bandwidth, 0 = disable feature
# MaxBandwidth will be used as fallback value when enabled
BandwidthDetection 1

# maximum bandwidth (Mbit) for all interfaces, 0 = disable feature
# (unless interface specific limit is given)
MaxBandwidth 1000

# interface specific limits
#  example 8Mbit limit for eth0 (remove # to activate):
#MaxBWeth0 8

# data retention durations (-1 = unlimited, 0 = feature disabled)
5MinuteHours   48
HourlyDays      4
DailyDays      62
MonthlyMonths  25
YearlyYears    -1
TopDayEntries  20

# how often (in seconds) interface data is updated
UpdateInterval 20

# how often (in seconds) interface status changes are checked
PollInterval 5

# how often (in minutes) data is saved to database
SaveInterval 5

# how often (in minutes) data is saved when all interface are offline
OfflineSaveInterval 30

# on which day should months change
MonthRotate 1
MonthRotateAffectsYears 0

# filesystem disk space check (1 = enabled, 0 = disabled)
CheckDiskSpace 1

# how much the boot time can variate between updates (seconds)
BootVariation 15

# create database entries even when there is no traffic (1 = enabled, 0 = disabled)
TrafficlessEntries 1

# how many minutes to wait during daemon startup for system clock to
# sync time if most recent database update appears to be in the future
TimeSyncWait 5

# how often (in minutes) bandwidth detection is done when
# BandwidthDetection is enabled (0 = disabled)
BandwidthDetectionInterval 5

# force data save when interface status changes (1 = enabled, 0 = disabled)
SaveOnStatusChange 1

# enable / disable logging (0 = disabled, 1 = logfile, 2 = syslog)
UseLogging 2

# create dirs if needed (1 = enabled, 0 = disabled)
CreateDirs 1

# update ownership of files if needed (1 = enabled, 0 = disabled)
UpdateFileOwner 1

# file used for logging if UseLogging is set to 1
LogFile "/var/log/vnstat/vnstat.log"

# file used as daemon pid / lock file
PidFile "/run/vnstat/vnstat.pid"

# 1 = 64-bit, 0 = 32-bit, -1 = old style logic, -2 = automatic detection
64bitInterfaceCounters -2

# use SQLite Write-Ahead Logging mode (1 = enabled, 0 = disabled)
DatabaseWriteAheadLogging 0

# change the setting of the SQLite "synchronous" flag
# (-1 = auto, 0 = off, 1, = normal, 2 = full, 3 = extra)
DatabaseSynchronous -1


# vnstati
##

# title timestamp format
HeaderFormat "%Y-%m-%d %H:%M"

# show hours with rate (1 = enabled, 0 = disabled)
HourlyRate 1

# show rate in summary (1 = enabled, 0 = disabled)
SummaryRate 1

# transparent background (1 = enabled, 0 = disabled)
TransparentBg 0

# image colors
CBackground     "FFFFFF"
CEdge           "AEAEAE"
CHeader         "606060"
CHeaderTitle    "FFFFFF"
CHeaderDate     "FFFFFF"
CText           "000000"
CLine           "B0B0B0"
CLineL          "-"
CRx             "92CF00"
CTx             "606060"
CRxD            "-"
CTxD            "-"
```

interface 为当前需要监控的网络接口
与 example config 区别在于

```
UnitMode 1
RateUnit 0
RateUnitMode 1
```

以上配置项改动之后更符合常规显示方式

### 3. Linux XanMod Kernel

[XanMod](https://xanmod.org/) 这个 kernel 基于最新的 Linux Kernel Mainline 同时包含了 Google BBRv2 并且做了一定的 Cache Memory 优化 目前在 us-sc 上测试效果评估中 若效果不错，会将此内核推广至其他机器上 同时于 us-sc 上测试 BBRv2 与 BBR 之间的性能差异
us-sc 上使用的是 qdisc: fq_pie;comgestion_control: bbr2 (虽然我是没看出来有快多少....)

### 4. ulimit 优化

`vi /etc/security/limit.conf`

```
*                 soft	  nproc           10240
*                 hard	  nproc           10240
*                 soft    nofile          10240
*                 hard    nofile          10240

root              soft    nproc           10240
root              hard    nproc           10240
root              soft    nofile          10240
root              hard    nofile          10240
```

`vi /etc/profile`

```
ulimit -n 10240
ulimit -u 8192
ulimit -m unlimited
```
