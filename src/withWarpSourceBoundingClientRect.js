import PropTypes from 'prop-types'
import React from 'react'

export const withWarpSourceBoundingClientRect = (BaseComponent) => {
  class WrappedComponent extends React.PureComponent {
    constructor (props) {
      super(props)

      this.state = { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }

      this.reposition = this.reposition.bind(this)
    }

    componentDidMount () {
      window.requestAnimationFrame(this.reposition)
      window.addEventListener('resize', this.reposition)
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.reposition)
    }

    componentDidUpdate () {
      this.reposition()
    }

    reposition () {
      const sourceNode = this.context.warpSource
      const boundingClientRect = sourceNode && sourceNode.getBoundingClientRect() || {}
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
    }

    render () {
      return <BaseComponent
        {...this.props}
        warpSourceBoundingClientRect={this.state}
      />
    }
  }

  WrappedComponent.contextTypes = {
    warpSource: PropTypes.object
  }

  return WrappedComponent
}

export default withWarpSourceBoundingClientRect
