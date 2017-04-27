import React from 'react';

export var withWarpPortal = function withWarpPortal(WarpPortal) {
  return function (BaseComponent) {
    return function (props) {
      return React.createElement(
        WarpPortal,
        null,
        React.createElement(BaseComponent, props)
      );
    };
  };
};

export default withWarpPortal;