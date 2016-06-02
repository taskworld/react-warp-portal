import calculateChildPosition from 'positioning-strategy'
import React from 'react'
import ReactDOM from 'react-dom'

import withWarpPortal from './withWarpPortal'
import withWarpSourceParentBoundingClientRect from './withWarpSourceParentBoundingClientRect'

export const popupWithWarpPortal = (WarpPortal) => (BaseComponent) => (
  withWarpPortal(WarpPortal)(
    withWarpSourceParentBoundingClientRect(React.createClass({
      propTypes: {
        strategy: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.func
        ]),
        gap: React.PropTypes.number,

        // from withWarpSourceParentBoundingClientRect
        warpSourceParentBoundingClientRect: React.PropTypes.object
      },
      getInitialState () {
        return { left: 0, top: 0, calculated: false }
      },
      componentDidMount () {
        window.requestAnimationFrame(this.reposition)
        window.addEventListener('resize', this.reposition)
      },
      componentWillUnmount () {
        window.removeEventListener('resize', this.reposition)
      },
      componentDidUpdate () {
        this.reposition()
      },
      reposition () {
        const parentRect = this.props.warpSourceParentBoundingClientRect
        if (parentRect.width === 0 && parentRect.height === 0) {
          return
        }
        const childRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
        const viewportRect = { width: window.innerWidth, height: window.innerHeight }
        const targetState = {
          ...calculateChildPosition(this.props.strategy, parentRect, childRect, viewportRect, {
            gap: this.props.gap
          }),
          calculated: true
        }
        if (
          targetState.left !== this.state.left ||
          targetState.top !== this.state.top ||
          targetState.calculated !== this.state.calculated
        ) {
          this.setState(targetState)
        }
      },
      render () {
        const { strategy, gap, warpSourceParentBoundingClientRect, ...props } = this.props
        void (strategy, gap, warpSourceParentBoundingClientRect)
        return (
          <div
            style={{
              position: 'fixed',
              left: this.state.left,
              top: this.state.top,
              opacity: this.state.calculated ? 1 : 0,
              pointerEvents: this.state.calculated ? '' : 'none'
            }}
          >
            <BaseComponent {...props} onRepositionNeeded={this.reposition} />
          </div>
        )
      }
    }))
  )
)

export default popupWithWarpPortal
