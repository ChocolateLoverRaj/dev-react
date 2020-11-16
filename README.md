# dev-react
Develop React components and websites.

## In Development
This module is still in development and is not yet `1.0.0` in semver. Any minor change can (and probably will) be a breaking change.

## Install
You will probably want to save this as a `devDependency`, which makes sense, because this module is literally called *`dev`*`-react`.
```bash
npm i --save-dev @programmerraj/dev-react
```

## ESModules
This package uses [ECMAScript Modules](https://nodejs.org/api/esm.html)

## Quick Start
This example shows how to start watching a dir.

### File Structure
- a-folder/
  - _common/
  - _index/
  - page/
  - page subpage/
  - ~~a normal file~~
  - ~~_dir/~~

A folder is required. It can be named anything. Inside that folder you can create a folder for each page. 

The names of the pages will reflect the path they are served on. For example, a folder called `page` will be served on `/page`. 

To create subpages, separate them with a space. A folder called `page subpage` will be `/page/subpage`.

There are two special folders. Special folders begin with `_`. 
- `_index`: Like a normal page, but it is the main page. It will be `/`.
- `_common`: Not a page, but a folder to place files common to multiple pages.

Creating a folder that starts with `_` which is not `_index` or `_common` will show a warning.

Any normal files in the pages folder will be ignored, and a warning will be shown.

### Script
```javascript
import DevReact from '@programmerraj/dev-react'

const dev = new DevReact('a-folder')
dev.watch()
```

## API
The main file default exports the `DevReact` class.

### constructor(inputDir)
- inputDir: Path to a directory with pages.
### prototype
- [watch](#watch)
- [unwatch](#unwatch)
### watch()
Start watching the `inputDir`. For more info about `inputDir` go to [file structure](#File-Structure).
- return: A promise which resolves `undefined`
### unwatch()
Stops watching the `inputDir`.
- return: A promise which resolves `undefined`
