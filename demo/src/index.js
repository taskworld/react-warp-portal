import React from 'react'
import {render} from 'react-dom'

import { createWarp } from '../../src'

const { WarpPortal, WarpDestination } = createWarp()

let Demo = React.createClass({
  render() {
    return (
      <div>
        <h1>react-warp-portal Demo</h1>
        <div style={{ padding: 16, border: '2px solid #cba' }}>
          <h2>WarpPortal</h2>
          <p>Anything that gets rendered into WarpPortal will be mounted at WarpDestination!</p>
          <WarpPortal>Hello world!</WarpPortal>
        </div>
        <div style={{ padding: 16, border: '2px solid #abc' }}>
          <h2>WarpDestination</h2>
          <p>Things put into WarpPortal will display here!</p>
          <WarpDestination />
        </div>
      </div>
    )
  }
})

render(<Demo/>, document.querySelector('#demo'))
