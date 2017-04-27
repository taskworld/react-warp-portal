var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

export var withWarpSourceBoundingClientRect = function withWarpSourceBoundingClientRect(BaseComponent) {
  return React.createClass({
    contextTypes: {
      warpSource: React.PropTypes.object
    },
    getInitialState: function getInitialState() {
      return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };
    },
    componentDidMount: function componentDidMount() {
      window.requestAnimationFrame(this.reposition);
      window.addEventListener('resize', this.reposition);
    },
    componentWillUnmount: function componentWillUnmount() {
      window.removeEventListener('resize', this.reposition);
    },
    componentDidUpdate: function componentDidUpdate() {
      this.reposition();
    },
    reposition: function reposition() {
      var sourceNode = this.context.warpSource;
      var boundingClientRect = sourceNode && sourceNode.getBoundingClientRect() || {};
      var _boundingClientRect$t = boundingClientRect.top;
      var top = _boundingClientRect$t === undefined ? 0 : _boundingClientRect$t;
      var _boundingClientRect$l = boundingClientRect.left;
      var left = _boundingClientRect$l === undefined ? 0 : _boundingClientRect$l;
      var _boundingClientRect$w = boundingClientRect.width;
      var width = _boundingClientRect$w === undefined ? 0 : _boundingClientRect$w;
      var _boundingClientRect$h = boundingClientRect.height;
      var height = _boundingClientRect$h === undefined ? 0 : _boundingClientRect$h;
      var _boundingClientRect$b = boundingClientRect.bottom;
      var bottom = _boundingClientRect$b === undefined ? 0 : _boundingClientRect$b;
      var _boundingClientRect$r = boundingClientRect.right;
      var right = _boundingClientRect$r === undefined ? 0 : _boundingClientRect$r;

      if (this.state.top !== top || this.state.left !== left || this.state.width !== width || this.state.height !== height || this.state.bottom !== bottom || this.state.right !== right) {
        this.setState({ top: top, left: left, width: width, height: height, bottom: bottom, right: right });
      }
    },
    render: function render() {
      return React.createElement(BaseComponent, _extends({}, this.props, {
        warpSourceBoundingClientRect: this.state
      }));
    }
  });
};

export default withWarpSourceBoundingClientRect;