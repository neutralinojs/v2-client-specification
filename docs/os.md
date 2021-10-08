---
title: Neutralino.os
---

`Neutralino.os` namespace contains methods related to the user's operating system.


## execCommand

Executes a command and returns the output.

```js
Neutralino.os.execCommand ('python --version')
```

## getEnv

Provides the value of a given environment variable.

```js
Neutralino.os.getEnv('USER')
  .then (response => `USER = ${response.value}`);
```

## showOpenDialog

Shows the file open dialog.

```js
let response = await Neutralino.os.showDialogOpen({
  title: 'Select a folder',
  isDirectoryMode: true
});
console.log(`You've selected: ${response.selectedEntry}`);
```

## showSaveDialog

Shows the file save dialog.

```js
let response = await Neutralino.os.showSaveDialog({
  title: 'Save to a file'
});
console.log(`You've selected: ${response.selectedEntry}`);
```

## showNotification

Displays a notification message.
```js
await Neutralino.os.showNotification({
  summary: 'Hello world',
  body: 'It works!. Have a nice day'
});
```

## showMessageBox

Displays a message box.

## setTray

Creates/updates the tray icon and menu.
```js
let tray = {
  icon: '/resources/icons/trayIcon.png',
  menuItems: [
    {id: "about", text: "About"},
    {text: "-"},
    {id: "quit", text: "Quit"}
  ]
};
await Neutralino.os.setTray(tray);
```

## Neutralino.os.open

Opens a URL with the default web browser.
:::tip If your application is running on the default web browser, this method will open a new tab. :::
