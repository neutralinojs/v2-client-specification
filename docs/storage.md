---
title: Neutralino.app
---

Neutralinojs has an in-built shared key-value storage. It's like a
global [`LocalStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for all Neutralinojs modes.
`Neutralinos.storage` exposes methods for interacting with this storage feature.

:::tip
The storage API persists all data records into `.storage` directory in the
root directory of your application. If you want to clear all data records,
delete the `.storage` directory.
:::


## setData

Writes data into Neutralinojs shared storage. 

```js
await Neutralino.storage.putData({
  bucket: 'userDetails',
  data: JSON.stringify({
    username: 'TestValue'
  })
});
```

## getData

Reads and returns data for a given Neutralinojs shared storage key. 
```js
let response = await Neutralino.storage.getData({
  bucket: 'userDetails'
});
console.log(`Data: ${response.data}`);
```

