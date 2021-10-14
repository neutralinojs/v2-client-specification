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

See the following changes.


## API structure changes

### app (Done)

- app.exit: No changes
- app.killProcess: No changes
- app.keepAlive: No changes
- app.getConfig: No changes
- app.open: os.open(url)

### window (Done)

- window.setTitle: No changes
- window.minimize: No changes
- window.maximize: No changes
- window.unmaximize: No changes
- window.isMaximized: No changes
- window.setFullScreen: No changes
- window.exitFullScreen: No changes
- window.isFullScreen: No changes
- window.show: No changes
- window.hide: No changes
- window.isVisible: No changes
- window.focus: No changes
- window.move: No changes
- window.setIcon: No changes
- window.setDraggableRegion: No changes
- window.setSize: No changes
- window.create: No changes

### filesystem (Done)

- filesystem.createDirectory: filesystem.createDirectory(dirPath)
- filesystem.removeDirectory: filesystem.removeDirectory(dirPath)
- filesystem.writeFile: filesystem.writeFile(fileLocation, dataString)
- filesystem.writeBinaryFile: filesystem.writeBinaryFile(fileLocation, binaryData)
- filesystem.readFile: filesystem.readFile(fileLocation) will return the file content directly.
- filesystem.readBinaryFile: filesystem.readBinaryFile(fileLocation) will return the binary content directly.
- filesystem.removeFile: filesystem.removeFile(fileLocation)
- filesystem.readDirectory: filesystem.readDirectory(dirPath) will return the `entries` directly.
- filesystem.copyFile: No changes
- filesystem.moveFile: No changes
- filesystem.getstats: No changes

### os (Done)

- os.execCommand: os.execCommand(command, {options}) will return the `output` directly.
- os.getEnvar: os.getEnv(key) will return the `value` directly.
- os.showDialogOpen: os.showOpenDialog(title, options) will return the `selectedEntries` directly. `isDirectoryMode` logic will be moved as a new function: `os.showFolderDialog(title)`
- os.showDialogSave: os.showDialogSave(title, options) will return the `selectedEntry` directly.
- os.showNotification: os.showNotification(title, content, icon)
- os.showMessageBox: os.showMessageBox(title, content, choice, icon)
- os.setTray: No changes

### computer (Done)

- computer.getRamUsage: computer.getMemoryInfo() will return all info properties without using `ram`.

### storage (Done)

- storage.putData: storage.setData(key, value)
- storage.getData: storage.getData(key) will return the `data` field directly.

### debug (Done)

- debug.log: debug.log(type, message). `type: WARN` needs to be renamed to `type: WARNING`.

### events (Done)

- events.on: No changes
- events.off: No changes
- events.dispatch: No changes
