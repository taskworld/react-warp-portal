import React from 'react';
import ReactDOM from 'react-dom';

var _nextId = 1;

// Creates a tangled pair of overlay.
export function createWarp() {
  var activeInstances = {};
  var _destinations = [];
  var _refreshQueued = false;

  function refresh() {
    _refreshQueued = false;
    _destinations.forEach(function (instance) {
      return instance.forceUpdate();
    });
  }

  var WarpPortal = React.createClass({
    displayName: 'WarpPortal',

    propTypes: {
      children: React.PropTypes.node,
      content: React.PropTypes.node
    },
    getInitialState: function getInitialState() {
      var id = 'warp' + _nextId++;
      return { id: id };
    },
    componentDidMount: function componentDidMount() {
      if (this.props.content) {
        activeInstances[this.state.id] = {
          children: this.props.content,
          element: ReactDOM.findDOMNode(this)
        };
        if (!_refreshQueued) {
          _refreshQueued = true;
          window.requestAnimationFrame(refresh);
        }
      }
    },
    componentDidUpdate: function componentDidUpdate() {
      if (this.props.content || activeInstances[this.state.id]) {
        activeInstances[this.state.id] = {
          children: this.props.content,
          element: ReactDOM.findDOMNode(this)
        };
        refresh();
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (activeInstances[this.state.id]) {
        delete activeInstances[this.state.id];
        refresh();
      }
    },
    render: function render() {
      if (!this.props.children || React.Children.count(this.props.children) === 0) {
        return React.createElement('span', { className: 'WarpPortal', 'data-warp-id': this.state.id, style: { display: 'none' } });
      }
      return React.Children.only(this.props.children);
    }
  });

  var WarpOutPortal = React.createClass({
    displayName: 'WarpOutPortal',

    propTypes: {
      children: React.PropTypes.node,
      warpId: React.PropTypes.string
    },
    childContextTypes: {
      warpSource: React.PropTypes.object
    },
    getChildContext: function getChildContext() {
      return { warpSource: this.props.warpSource };
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
      return nextProps.children !== this.props.children;
    },
    render: function render() {
      return React.createElement(
        'div',
        { className: 'Warp', 'data-warp-id': this.props.warpId },
        this.props.children
      );
    }
  });

  var WarpDestination = React.createClass({
    displayName: 'WarpDestination',
    componentDidMount: function componentDidMount() {
      _destinations.push(this);
    },
    componentWillUnmount: function componentWillUnmount() {
      var _this = this;

      _destinations = _destinations.filter(function (instance) {
        return instance !== _this;
      });
    },
    render: function render() {
      var children = [];
      for (var key in activeInstances) {
        children.push(React.createElement(
          WarpOutPortal,
          { key: key, warpSource: activeInstances[key].element, warpId: key },
          activeInstances[key].children
        ));
      }
      return React.createElement(
        'div',
        { className: 'WarpDestination' },
        children
      );
    }
  });

  return { WarpPortal: WarpPortal, WarpDestination: WarpDestination };
}