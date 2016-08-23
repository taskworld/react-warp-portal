import assert from 'assert'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createWarp } from 'src/'

const { WarpPortal, WarpDestination } = createWarp()

/* global describe, it, beforeEach, afterEach */

describe('createWarp', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('warps contents from portal to destination', (done) => {
    const element = (
      <div>
        <h1>react-warp-portal Test</h1>
        <div className='a'>
          <WarpPortal content={<div className='b'></div>}><div className='e'></div></WarpPortal>
          <WarpPortal content={<div className='c'></div>}><div className='f'></div></WarpPortal>
          <WarpPortal content={<div className='g'></div>} />
        </div>
        <div className='d'>
          <WarpDestination />
        </div>
      </div>
    )
    render(element, node, () => {
      setTimeout(() => {
        try {
          assertElement('.d .b')
          assertElement('.d .c')
          assertElement('.d .g')
          assertNoElement('.a .b')
          assertNoElement('.a .c')
          assertElement('.a .e')
          assertElement('.a .f')
          done()
        } catch (e) {
          console.log(node.innerHTML)
          done(e)
        }
      }, 100)
    })
  })

  it('renders component with state', (done) => {
    let _app
    const App = createApp()
    const element = (
      <div>
        <App ref={(app) => (_app = app)} />
        <WarpDestination />
      </div>
    )
    render(element, node, () => {
      setTimeout(() => {
        try {
          assertElement('.app .child .thing')
          assertNoElement('.Warp')
          assertNoElement('.counter')
          _app.toggle()
          assertElement('.Warp')
          assert.equal(assertElement('.counter').getAttribute('data-value'), '1')
          _app.update()
          assert.equal(assertElement('.counter').getAttribute('data-value'), '2')
          _app.toggle()
          assertNoElement('.counter')
          done()
        } catch (e) {
          console.log(node.innerHTML)
          done(e)
        }
      }, 100)
    })
    function createApp () {
      return class App extends React.Component {
        constructor (props) {
          super(props)
          this.state = { open: false, counter: 1 }
        }
        toggle () {
          this.setState({ open: !this.state.open })
        }
        update () {
          this.setState({ counter: this.state.counter + 1 })
        }
        renderContent () {
          if (!this.state.open) return null
          return (
            <div className='warped'>
              <div className='counter' data-value={this.state.counter}></div>
            </div>
          )
        }
        render () {
          return (
            <div className='app'>
              <WarpPortal content={this.renderContent()}>
                <div className='child'><span className='thing'>yep!</span></div>
              </WarpPortal>
            </div>
          )
        }
      }
    }
  })

  function assertElement (selector) {
    const el = node.querySelector(selector)
    assert(el, selector + ' must exist')
    return el
  }
  function assertNoElement (selector) {
    assert(!node.querySelector(selector), selector + ' must not exist')
  }
})
