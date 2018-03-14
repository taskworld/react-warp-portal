import React from 'react'
import ReactDOM from 'react-dom'

let _nextId = 1

// Creates a tangled pair of overlay.
export function createWarp () {
  const activeInstances = { }
  let _destinations = [ ]
  let _refreshQueued = false

  function refresh () {
    _refreshQueued = false
    _destinations.forEach(instance => instance.forceUpdate())
  }

  class WarpPortal extends React.PureComponent {
    constructor (props) {
      super(props)

      const id = 'warp' + (_nextId++)
      this.state = { id }
    }

    componentDidMount () {
      if (this.props.content) {
        activeInstances[this.state.id] = {
          children: this.props.content,
          element: ReactDOM.findDOMNode(this)
        }
        if (!_refreshQueued) {
          _refreshQueued = true
          window.requestAnimationFrame(refresh)
        }
      }
    }

    componentDidUpdate () {
      if (this.props.content || activeInstances[this.state.id]) {
        activeInstances[this.state.id] = {
          children: this.props.content,
          element: ReactDOM.findDOMNode(this)
        }
        refresh()
      }
    }

    componentWillUnmount () {
      if (activeInstances[this.state.id]) {
        delete activeInstances[this.state.id]
        refresh()
      }
    }

    render () {
      if (!this.props.children || React.Children.count(this.props.children) === 0) {
        return <span className='WarpPortal' data-warp-id={this.state.id} style={{ display: 'none' }}></span>
      }
      return React.Children.only(this.props.children)
    }
  }

  WarpPortal.propTypes = {
    children: React.PropTypes.node,
    content: React.PropTypes.node
  }

  class WarpOutPortal extends React.PureComponent {
    constructor (props) {
      super(props)

      const id = 'warp' + (_nextId++)
      this.state = { id }
    }

    getChildContext () {
      return { warpSource: this.props.warpSource }
    }

    shouldComponentUpdate (nextProps) {
      return nextProps.children !== this.props.children
    }

    render () {
      return (
        <div className='Warp' data-warp-id={this.props.warpId}>
          {this.props.children}
        </div>
      )
    }
  }

  WarpOutPortal.propTypes = {
    children: React.PropTypes.node,
    warpId: React.PropTypes.string
  }

  WarpOutPortal.childContextTypes = {
    warpSource: React.PropTypes.object
  }

  class WarpDestination extends React.PureComponent {
    componentDidMount () {
      _destinations.push(this)
    }

    componentWillUnmount () {
      _destinations = _destinations.filter((instance) => instance !== this)
    }

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
  }

  return { WarpPortal, WarpDestination }
}
