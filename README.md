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
- an-input-folder/
  - _common/
  - _index/
  - page/
  - page subpage/
  - ~~a normal file~~
  - ~~_dir/~~
- output-folder (auto generated)

An input folder is required. It can be named anything. Inside that folder you can create a folder for each page.

A path to an output folder is also required. The output folder will be created if it doesn't exist.

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

const dev = new DevReact({
  inputDir: 'an-input-folder',
  outputDir: 'output-folder'
})
dev.start()
```

## API
The main file default exports the `DevReact` class.

### constructor(options)
- options
  - inputDir: Path to a directory with pages.
  - outputDir: Path which output files get saved to.
### prototype
- [start](#start)
- [stop](#stop)
### start()
Start watching the `inputDir`. Also starts displaying build tasks. For more info about `inputDir` go to [file structure](#File-Structure).
- return: A promise which resolves `undefined`
### stop()
Stops watching the `inputDir`. Also stops displaying build tasks.
- return: A promise which resolves `undefined`
