---
title: Neutralino.window
---

`Neutralino.window` namespace contains methods related to the current native window instance.
This namespace's methods will work only for the [window](https://neutralino.js.org/docs/configuration/modes#window) mode.


## setTitle

Sets the title of the native window.

```js
Neutralino.window.setTitle ('My window')
```

## setSize

Resize the native window. \
This feature is suitable to make custom window bars along with the [borderless mode](https://neutralino.js.org/docs/configuration/neutralino.config.json#modeswindowborderless-boolean).

This method always expects width and height couples. \
For example, if you are sending `minWidth`, you should send `minHeight` too.
```js
Neutralino.window.setSize({
    width: 500,
    height: 200,
    maxWidth: 600,
    maxHeight: 400
});
```

```js
Neutralino.window.setSize({
    resizable: false
});
```


## setIcon

Sets an icon for the native window or Dock.

## focus

Focuses the native window.

## hide

Hides the native window.

## isVisible

Returns true if the native window is visible.

## show

Shows the native window.

## minimize

Minimizes the native window.

## maximize

Maximizes the native window.

## isMaximized

Returns true if the native window is maximized.

## unmaximize

Restores the native window.

## setFullScreen

Enables the full screen mode.

## isFullScreen

Returns true if the native window is in the full screen mode.

## exitFullScreen

Exits from the full screen mode.

## move

Moves the native window into given coordinates. \
Neutralinojs's cross-platform coordinate system starts from top-left corner of the screen.
In other words, `x=0,y=0` point refers to the top-left corner of the device's main screen.

