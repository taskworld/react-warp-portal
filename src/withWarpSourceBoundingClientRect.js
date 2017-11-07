import React from 'react'
import PropTypes from 'prop-types'

export const withWarpSourceBoundingClientRect = (BaseComponent) => React.createClass({
  contextTypes: {
    warpSource: PropTypes.object
  },
  getInitialState () {
    return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }
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
    const sourceNode = this.context.warpSource
    const boundingClientRect = sourceNode && sourceNode.getBoundingClientRect() || { }
    const {
      top = 0,
      left = 0,
      width = 0,
      height = 0,
      bottom = 0,
      right = 0
    } = boundingClientRect
    if (
      this.state.top !== top ||
      this.state.left !== left ||
      this.state.width !== width ||
      this.state.height !== height ||
      this.state.bottom !== bottom ||
      this.state.right !== right
    ) {
      this.setState({ top, left, width, height, bottom, right })
    }
  },
  render () {
    return <BaseComponent
      {...this.props}
      warpSourceBoundingClientRect={this.state}
    />
  }
})

export default withWarpSourceBoundingClientRect
