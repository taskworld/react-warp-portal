module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'ReactWarpPortal',
    jsNext: true,
    umd: true
  }
}
