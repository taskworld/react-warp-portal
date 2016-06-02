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
          assert(node.querySelector('.a .e'), '.a .e must exist')
          assert(node.querySelector('.a .f'), '.a .f must exist')
          done()
        } catch (e) {
          console.log(node.innerHTML)
          done(e)
        }
      }, 100)
    })
  })
})
