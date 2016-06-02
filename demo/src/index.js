import React from 'react'
import { render } from 'react-dom'

import { createWarp, popupWithWarpPortal } from '../../src'

const { WarpPortal, WarpDestination } = createWarp()

const Menu = React.createClass({
  getInitialState () {
    return { items: [ 'Hello!', 'World!!' ] }
  },
  componentDidUpdate () {
    this.props.onRepositionNeeded()
  },
  render () {
    return (
      <div style={{ border: '2px solid #543', background: '#faf9f8' }}>
        <MenuItem>Lorem ipsum dolor sit amet</MenuItem>
        {this.state.items.map((text, index) => <MenuItem key={index}>{text}</MenuItem>)}
        <MenuItem><a href='javascript://' onClick={this.moar}>Add new item!!</a></MenuItem>
      </div>
    )
  },
  moar () {
    this.setState(state => ({
      items: [ ...state.items, 'New item ' + new Date() ]
    }))
  }
})

const PopupMenu = popupWithWarpPortal(WarpPortal)(Menu)

const MenuItem = ({ children }) => <div>{children}</div>

const Demo = React.createClass({
  getInitialState () {
    return { menu: false }
  },
  onButtonClick () {
    this.setState(state => ({ menu: !state.menu }))
  },
  render () {
    return (
      <div>
        <h1>react-warp-portal Demo</h1>
        <div style={{ padding: 16, border: '2px solid #cba' }}>
          <h2>WarpPortal</h2>
          <p>Anything that gets rendered into WarpPortal will be mounted at WarpDestination!</p>
          <WarpPortal>Hello world!!!</WarpPortal>

          <h3>Applications of a WarpPortal</h3>
          <p>For instance, you can use it to create a popup menu.</p>
          <div style={{ width: 200, height: 200, overflow: 'auto', background: '#e1e2e3' }}>
            This div has <code>{'{ overflow: auto; }'}</code> CSS property set.
            This means that you cannot render a popup menu directly here, because it will be cropped inside the scrollable area.
            <span>
              <button onClick={this.onButtonClick}>Toggle menu!</button>
              {this.state.menu
                ? <PopupMenu strategy='top left' gap={6} />
                : null
              }
            </span>
          </div>
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

render(<Demo />, document.querySelector('#demo'))
