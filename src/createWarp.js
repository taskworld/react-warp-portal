import React from 'react'
import ReactDOM from 'react-dom'

let _nextId = 1

// Creates a tangled pair of overlay.
export function createWarp () {
  const activeInstances = { }
  let _destinations = [ ]

  function refresh () {
    _destinations.forEach(instance => instance.forceUpdate())
  }

  const WarpPortal = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      content: React.PropTypes.node
    },
    getInitialState () {
      const id = 'warp' + (_nextId++)
      return { id }
    },
    componentDidMount () {
      activeInstances[this.state.id] = {
        children: this.props.content,
        element: ReactDOM.findDOMNode(this)
      }
      window.requestAnimationFrame(refresh)
    },
    componentDidUpdate () {
      activeInstances[this.state.id] = {
        children: this.props.content,
        element: ReactDOM.findDOMNode(this)
      }
      refresh()
    },
    componentWillUnmount () {
      delete activeInstances[this.state.id]
      refresh()
    },
    render () {
      if (!this.props.children || React.Children.count(this.props.children) === 0) {
        return <span className='WarpPortal' data-warp-id={this.state.id} style={{ display: 'none' }}></span>
      }
      return React.Children.only(this.props.children)
    }
  })

  const WarpOutPortal = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      warpId: React.PropTypes.warpId
    },
    childContextTypes: {
      warpSource: React.PropTypes.object
    },
    getChildContext () {
      return { warpSource: this.props.warpSource }
    },
    shouldComponentUpdate (nextProps) {
      return nextProps.children !== this.props.children
    },
    render () {
      return (
        <div className='Warp' data-warp-id={this.props.warpId}>
          {this.props.children}
        </div>
      )
    }
  })

  const WarpDestination = React.createClass({
    componentDidMount () {
      _destinations.push(this)
    },
    componentWillUnmount () {
      _destinations = _destinations.filter((instance) => instance !== this)
    },
    render () {
      const children = [ ]
      for (let key in activeInstances) {
        children.push(
          <WarpOutPortal key={key} warpSource={activeInstances[key].element} warpId={key}>
            {activeInstances[key].children}
          </WarpOutPortal>
        )
      }
      return (
        <div className='WarpDestination'>
          {children}
        </div>
      )
    }
  })

  return { WarpPortal, WarpDestination }
}
