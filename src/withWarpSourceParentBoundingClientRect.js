import React from 'react'

export const withWarpSourceParentBoundingClientRect = (BaseComponent) => React.createClass({
  contextTypes: {
    warpSource: React.PropTypes.object
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
    const element = this.context.warpSource
    const parentNode = element && element.parentNode
    const parentBoundingClientRect = parentNode && parentNode.getBoundingClientRect() || { }
    const {
      top = 0,
      left = 0,
      width = 0,
      height = 0,
      bottom = 0,
      right = 0
    } = parentBoundingClientRect
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
      warpSourceParentBoundingClientRect={this.state}
    />
  }
})
