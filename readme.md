# httplogviewer CLI

A nodejs CLI to easily view and manage http logs

![](/cli.png)

## Install

```shell
npm install httplogviewer -g
```

## Usage

```shell
httplogviewer http_file.log --status 200

with npx:
npx httplogviewer http_file.log --status 200
```

Type `httplogviewer --help` to see the main commands

When the CLI shows up, you can use the following keys to navigate on screen:

- `return` key to select ip (it focuses on the right side box)
- `i` to focus on ip list and select another ip
- `up` and `down` arrows to scroll log
- `q` or `Ctrl+c` to exit

# License

MIT - see LICENSE
