import assert from 'assert'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { createWarp } from 'src/'

const { WarpPortal, WarpDestination } = createWarp()

/* global describe, it */

describe('createWarp', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('warps elements from portal to destination', (done) => {
    const element = (
      <div>
        <h1>react-warp-portal Test</h1>
        <div className='a'>
          <WarpPortal><div className='b'></div></WarpPortal>
          <WarpPortal><div className='c'></div></WarpPortal>
        </div>
        <div className='d'>
          <WarpDestination />
        </div>
      </div>
    )
    render(element, node, () => {
      setTimeout(() => {
        try {
          assert(node.querySelector('.d .b'), '.d .b must exist')
          assert(node.querySelector('.d .c'), '.d .c must exist')
          assert(!node.querySelector('.a .b'), '.a .b must not exist')
          assert(!node.querySelector('.a .c'), '.a .c must not exist')
          done()
        } catch (e) {
          console.log(node.innerHTML)
          done(e)
        }
      }, 100)
    })
  })
})
