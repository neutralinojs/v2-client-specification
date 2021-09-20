# v2-client-specification
### Changing the structure of JavaScript API

## Goal

The current JavaScript API of Neutralinojs looks a bit inconsistent. For example, `os.createDirectory` asks for `CreateDirectoryOptions` type, but `window.move` accepts two parameters: `x` and `y`. As you can see, some functions follow different patterns. In v2, we are planning to make the JavaScript API consistent by using the following pattern.

```js
namespace.methodName(mandatoryArgs.., {optionalArgs...})

// Example
namespace.os.exeCommand('bash longtask.sh', {shouldRunInBackground: true});

```

## Breaking changes

This version has no effect on Neutralinojs server and there is no change in the communication interface between client and the server. v2 is just for restructuring the Neutralinojs JavaScript API.

## API structure changes

### app

- app.exit: No changes
- app.killProcess: No changes
- app.keepAlive: No changes
- app.getConfig: This will return the config object directly without the `config` attribute.
- app.open: app.open(url)

### window


