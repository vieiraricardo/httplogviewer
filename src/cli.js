const { build } = require('gluegun')
const help = require('./lib/help')

/**
 * Create the cli and kick it off
 */

async function run (argv) {
  // create a CLI runtime
  const cli = build()
    .brand('httplogviewer')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'httplogviewer-*', hidden: true })
    .help({
      name: 'help',
      alias: 'h',
      dashed: true,
      run: help
    }) // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create()

  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

module.exports = { run }
