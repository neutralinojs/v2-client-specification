---
title: Neutralino.app
---

`Neutralino.app` namespace contains methods related to the current application instance.


## exit

Terminates the running application.

```js
await Neutralino.app.exit();
```

```js
await Neutralino.app.exit(130);
```

## getConfig

Returns the current application configuration as a JSON object.

```js
Neutralino.app.getConfig ()
```

## keepAlive

The keepAlive method is responsible for saving the Neutralinojs server instance from the automatic termination.
This method is called automatically from the client library for the browser mode.

```js
Neutralino.app.keepAlive();
```

## killProcess

Kills the application process.
If the application becomes unresponsive, you can use this to terminate the process instantly.
However, we recommend you to use the `exit()` method to close your application properly.

```js
await Neutralino.app.killProcess();
```
