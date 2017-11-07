import calculateChildPosition from 'positioning-strategy'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import withWarpSourceBoundingClientRect from './withWarpSourceBoundingClientRect'

export const popup = (BaseComponent) => (
  withWarpSourceBoundingClientRect(React.createClass({
    propTypes: {
      strategy: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
      ]),
      gap: PropTypes.number,
      bindingY: PropTypes.oneOf([
        'top', 'bottom'
      ]),
      // from withWarpSourceBoundingClientRect
      warpSourceBoundingClientRect: PropTypes.object
    },
    getDefaultProps () {
      return {
        bindingY: 'top'
      }
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
      const parentRect = this.props.warpSourceBoundingClientRect
      if (parentRect.width === 0 && parentRect.height === 0) {
        return
      }
      const childRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
      const viewportRect = { width: window.innerWidth, height: window.innerHeight }
      const targetState = {
        ...calculateChildPosition(this.props.strategy, parentRect, childRect, viewportRect, {
          gap: this.props.gap || 0
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
      const getBottomPositionFromTop = (top, element) => {
        const childRect = ReactDOM.findDOMNode(element).getBoundingClientRect()
        return (window.innerHeight - this.state.top - childRect.height)
      }
      const { strategy, gap, warpSourceParentBoundingClientRect, ...props } = this.props
      const yAxis = this.props.bindingY === 'top' || !this.state.calculated ?
        { top: this.state.top } :
        { bottom: getBottomPositionFromTop(this.state.top, this) }
      void (strategy, gap, warpSourceParentBoundingClientRect)
      return (
        <div
          style={{
            position: 'fixed',
            left: this.state.left,
            opacity: this.state.calculated ? 1 : 0,
            pointerEvents: this.state.calculated ? '' : 'none',
            ...yAxis
          }}
        >
          <BaseComponent {...props} onRepositionNeeded={this.reposition} />
        </div>
      )
    }
  }))
)

export default popup
