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

A folder is required. It can be named anything.

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
Start watching the `inputDir`.
- return: A promise which resolves `undefined`
### unwatch()
Stops watching the `inputDir`.
- return: A promise which resolves `undefined`
