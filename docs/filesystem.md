---
title: Neutralino.filesystem
---

`Neutralino.filesystem` namespace contains methods for handling files.


## createDirectory

Creates a new directory.

```js
Neutralino.filesystem.createDirectory ({
  path: './newDirectory',
});
```

## removeDirectory

Removes given directories.

```js
await Neutralino.filesystem.removeDirectory({
  path: './tmpDirectory',
});
```

## writeFile

Writes new text files with data.

```js
await Neutralino.filesystem.writeFile({
  fileName: './myFile.txt',
  data: 'Sample content'
});
```

## writeBinaryFile

Writes new binary files with data.

```js
let rawBin = new ArrayBuffer(1);
let view = new Uint8Array(rawBin);
view[0] = 64; // Saves ASCII '@' to the binary file
await Neutralino.filesystem.writeBinaryFile({
  fileName: './myFile.bin',
  data: rawBin
});
```

## readFile

Reads text files.

```js
let response = await Neutralino.filesystem.readFile({
  fileName: './myFile.txt'
});
console.log(`Content: ${response.data}`);
```

## readBinaryFile

Reads binary files.

```js
let response = await Neutralino.filesystem.readBinaryFile({
  fileName: './myFile.bin'
});
let view = new Uint8Array(response.data);
console.log('Binary content: ', view);
```

## removeFile

Removes given file.

```js
await Neutralino.filesystem.removeFile({
  fileName: './myFile.txt'
});
```

## readDirectory

Reads a whole directory.

```js
let response = await Neutralino.filesystem.readDirectory({
  path: NL_PATH
});
console.log('Content: ', response.entries);
```

## copyFile

Copies a file to a new destination.

```js
await Neutralino.filesystem.copyFile({
  source: './source.txt',
  destination: './destination.txt'
});
```

## moveFile

Moves a file to a new destination.

```js
await Neutralino.filesystem.moveFile({
  source: './source.txt',
  destination: './destination.txt'
});
```

## getStats

Returns file statistics for the given path. If the given path doesn't exist or is unable to access, 
the awaited method will throw an error. Therefore, you can use this method to check the existance of a file or directory.

```js
let response = await Neutralino.filesystem.getStats({
  path: './sampleVideo.mp4'
});
console.log('Stats:', response);
```
