# <img src="https://i.imgur.com/7Tv7sKw.png" alt="react-warp-portal" />

[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Creates a wrap portal.
All components rendered inside the warp portal will appear at the warp destination.
Useful for popup menus, tooltips, overlays, dialogs, lightboxes.


## Creating the components

```js
// warp.js
import { createWarp } from 'react-warp-portal'
export const { WarpPortal, WarpDestination } = createWarp()
```

The generated WarpPortal and WarpDestination are entangled.


## Using the created components

```js
// App.js
import { WarpDestination } from './warp'

// ...
  render () {
    return <div>
      {/* ... */}
      <WarpDestination /> {/* things went into WarpPortal will display here */}
    <div>
  }
// ...
```

```js
// SomewhereElse.js
import { WarpPortal } from './warp'

// ...
  render () {
    return <div>
      <WarpPortal content={<div>This displays at the WarpDestination.</div>}>
        <p>This displays here.</p>
      </WarpPortal>
    </div>
  }
// ...
```

The rendered content is entangled with the WarpSource.
You can access `this.context.warpSource` to obtain the DOM node.
This allows positioning such as tooltips.


[npm-badge]: https://img.shields.io/npm/v/react-warp-portal.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-warp-portal

[coveralls-badge]: https://img.shields.io/coveralls/taskworld/react-warp-portal/master.svg?style=flat-square
[coveralls]: https://coveralls.io/github/taskworld/react-warp-portal
