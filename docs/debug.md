---
title: Neutralino.app
---

`Neutralino.debug` namespace contains application debugging utilities.


## log

Writes messages to `neutralino.log` file. 

:::tip
If your application is running via `neu run` or `neu listen`, you can see log
messages on your terminal.
:::

```js
Neutralino.debug.log({
  type: 'INFO',
  message: 'Test message'
});
```
