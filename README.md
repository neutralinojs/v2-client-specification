# v2-specification

## Goal

The current JavaScript API of Neutralinojs looks a bit inconsistent. For example, `os.createDirectory` asks for `CreateDirectoryOptions` type, but `window.move` accepts two parameters: `x` and `y`. As you can see, some functions follow different patterns. In v3, we are planning to make the JavaScript API consistent by using the following pattern.

```js
namespace.methodName(mandatoryArgs.., {optionalArgs...})
```


