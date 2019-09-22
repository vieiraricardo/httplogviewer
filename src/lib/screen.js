const blessed = require('blessed')
const { exec } = require('child_process')

const screen = blessed.screen({
  smartCSR: true
})

const sidebar = blessed.box({
  parent: screen,
  width: '200',
  height: '100%',
  border: 'line',
  left: 0
})

const ipList = blessed.list({
  parent: sidebar,
  top: 0,
  left: 0,
  width: 'shrink',
  height: 'shrink',
  keys: true,
  mouse: true,
  tags: true,
  style: {
    selected: {
      bg: 'gray'
    }
  }
})

const content = blessed.box({
  parent: screen,
  width: screen.width - sidebar.width,
  height: '100%',
  right: 0,
  border: 'line',
  scrollable: true,
  alwaysScroll: true,
  mouse: true,
  keys: true,
  scrollbar: {
    style: {
      bg: 'yellow'
    }
  }
})

function renderScreen (args) {
  const { string: file, options } = args

  getIpList(file)
  screen.append(content)
  sidebar.append(ipList)

  screen.on('resize', () => screen.render())

  screen.key(['C-c', 'q'], function (ch, key) {
    screen.destroy()
  })

  screen.key(['i'], (ch, key) => {
    ipList.focus()
    screen.render()
  })

  ipList.on('select', item => {
    const regexp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
    const ip = item.content.match(regexp)[0]

    getLogByIp(ip, file, options.s)
    screen.render()
  })

  screen.render()
}

function getIpList (file) {
  exec(`cut -d " " -f 1 ${file} | sort | uniq -c | sort -nr`, (err, data) => {
    if (err) return ipList.insertItem(0, err.stack)
    data.split(/\n/).forEach((item, i) => {
      ipList.insertItem(i, `{bold}${item}{/}`)
    })

    ipList.focus()
    screen.render()
  })
}

function getLogByIp (ip, file, status) {
  const command = status
    ? `grep ${ip} ${file} | grep " ${status}" | cut -d " " -f 6- `
    : `grep ${ip} ${file} | cut -d " " -f 6- `

  exec(command, { maxBuffer: 1024 * 1024 * 10 }, (err, data) => {
    if (err) return content.setContent(err.stack)

    content.setContent(data)
    content.focus()
    screen.render()
  })
}

module.exports = renderScreen

// fs.readFile(process.argv[2], (err, data) => {
//   if (err) return console.log(err)
//   const log = data.toString()
//   const regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/ig
//   console.log(log.match(regexp))
// })
