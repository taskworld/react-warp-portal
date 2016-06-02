import React from 'react'

export const withWarpPortal = (WarpPortal) => (BaseComponent) => (props) => (
  <WarpPortal><BaseComponent {...props} /></WarpPortal>
)

export default withWarpPortal
