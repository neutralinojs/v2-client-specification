---
title: Neutralino.app
---

`Neutralino.debug` namespace contains application debugging utilities.


## computer.getMemoryInfo

Provides physical memory details (in megabytes).

```js
Neutralino.computer.getMemoryInfo()
  .then (ramInfo => `Your ram size: ${Math.round(ramInfo.total / 1000000)}GB`)
```
