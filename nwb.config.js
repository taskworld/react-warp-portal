module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactWarpPortal',
      externals: {
        'react': 'React'
      }
    }
  }
}
