const fs = require('fs')
const blessed = require('blessed')

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

function renderScreen(args) {
  const { string: file, options } = args

  getIpList(file)
  screen.append(content)
  sidebar.append(ipList)

  screen.on('resize', () => screen.render())

  screen.key(['C-c', 'q'], function(ch, key) {
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

function getIpList(file) {
  fs.readFile(file, (err, data) => {
    if (err) return ipList.insertItem(0, err.stack)
    const log = data.toString()
    const regexp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?=\s)/g

    let IPLIST = log.match(regexp).reduce((acc, cur) => {
      if (!acc) return acc.set(cur, 1)

      let ip = acc.get(cur)
      return ip ? acc.set(cur, ip + 1) : acc.set(cur, 1)
    }, new Map())

    IPLIST[Symbol.iterator] = function*() {
      yield* [...this.entries()].sort((a, b) => a[1] - b[1])
    }

    for (let [key, value] of IPLIST.entries()) {
      ipList.insertItem(value, `  {green-fg}${value}{/green-fg}{|}${key}  `)
    }

    ipList.focus()
    screen.render()
  })
}

function getLogByIp(ip, file, status) {
  fs.readFile(file, (err, data) => {
    const logByIp = status
      ? new RegExp(`(?<=${ip}.+)(".+"\\s${status}(?=\\s\\d))`, 'g')
      : new RegExp(`(?<=${ip}.+)(".+"\\s\\d{3}(?=\\s\\d))`, 'g')

    let logArray = data.toString().match(logByIp)

    if (!logArray) {
      content.setLine(15, `Log with status code ${status} not found.`)
      screen.render()
      return
    }

    const log = logArray.toString().replace(/,/g, '\n\n')

    content.setContent(log)
    content.focus()
    screen.render()
  })
}

module.exports = renderScreen
