import React from 'react'

// Creates a tangled pair of overlay.
export function createWarp () {
  const activeInstances = { }
  let _nextId = 1
  let _destinations = [ ]

  function refresh () {
    _destinations.forEach(instance => instance.forceUpdate())
  }

  const WarpPortal = React.createClass({
    propTypes: {
      children: React.PropTypes.node
    },
    getInitialState () {
      const id = 'warp' + (_nextId++)
      activeInstances[id] = this.props.children
      return { id }
    },
    componentDidMount () {
      activeInstances[this.state.id] = this.props.children
      refresh()
    },
    componentDidUpdate () {
      activeInstances[this.state.id] = this.props.children
      refresh()
    },
    componentWillUnmount () {
      delete activeInstances[this.state.id]
      refresh()
    },
    render () {
      return null
    }
  })

  const WarpOutPortal = React.createClass({
    propTypes: {
      children: React.PropTypes.node
    },
    shouldComponentUpdate (nextProps) {
      return nextProps.children !== this.props.children
    },
    render () {
      return (
        <div className='Warp'>
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
          <WarpOutPortal key={key}>{activeInstances[key]}</WarpOutPortal>
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
