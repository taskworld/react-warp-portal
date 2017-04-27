var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import calculateChildPosition from 'positioning-strategy';
import React from 'react';
import ReactDOM from 'react-dom';

import withWarpSourceBoundingClientRect from './withWarpSourceBoundingClientRect';

export var popup = function popup(BaseComponent) {
  return withWarpSourceBoundingClientRect(React.createClass({
    propTypes: {
      strategy: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
      gap: React.PropTypes.number,
      bindingY: React.PropTypes.oneOf(['top', 'bottom']),
      // from withWarpSourceBoundingClientRect
      warpSourceBoundingClientRect: React.PropTypes.object
    },
    getDefaultProps: function getDefaultProps() {
      return {
        bindingY: 'top'
      };
    },
    getInitialState: function getInitialState() {
      return { left: 0, top: 0, calculated: false };
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
      var parentRect = this.props.warpSourceBoundingClientRect;
      if (parentRect.width === 0 && parentRect.height === 0) {
        return;
      }
      var childRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      var viewportRect = { width: window.innerWidth, height: window.innerHeight };
      var targetState = _extends({}, calculateChildPosition(this.props.strategy, parentRect, childRect, viewportRect, {
        gap: this.props.gap || 0
      }), {
        calculated: true
      });
      if (targetState.left !== this.state.left || targetState.top !== this.state.top || targetState.calculated !== this.state.calculated) {
        this.setState(targetState);
      }
    },
    render: function render() {
      var _this = this;

      var getBottomPositionFromTop = function getBottomPositionFromTop(top, element) {
        var childRect = ReactDOM.findDOMNode(element).getBoundingClientRect();
        return window.innerHeight - _this.state.top - childRect.height;
      };
      var _props = this.props;
      var strategy = _props.strategy;
      var gap = _props.gap;
      var warpSourceParentBoundingClientRect = _props.warpSourceParentBoundingClientRect;

      var props = _objectWithoutProperties(_props, ['strategy', 'gap', 'warpSourceParentBoundingClientRect']);

      var yAxis = this.props.bindingY === 'top' || !this.state.calculated ? { top: this.state.top } : { bottom: getBottomPositionFromTop(this.state.top, this) };
      void (strategy, gap, warpSourceParentBoundingClientRect);
      return React.createElement(
        'div',
        {
          style: _extends({
            position: 'fixed',
            left: this.state.left,
            opacity: this.state.calculated ? 1 : 0,
            pointerEvents: this.state.calculated ? '' : 'none'
          }, yAxis)
        },
        React.createElement(BaseComponent, _extends({}, props, { onRepositionNeeded: this.reposition }))
      );
    }
  }));
};

export default popup;