function help (toolbox) {
  const helpMessage = `
  httplogviewer: is a CLI to easily view  and manage http logs
  author: Ricardo Vieira

  Usage: httploviewer file.log [-svh]

  Options: 
    help: [-h, --help] <outupt this help>
    version: [-v, --version] <outupt the version number>
    status: [-s, --status] <accepts a http status code, e.g: 200, 301, 404>
  `

  toolbox.print.info(helpMessage)
}

module.exports = help
