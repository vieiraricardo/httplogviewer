module.exports = {
  name: 'httplogviewer',
  hidden: true,
  run: async toolbox => {
    const { parameters } = toolbox
    // print.info(parameters)
    require('../lib/screen')(parameters)
  }
}
