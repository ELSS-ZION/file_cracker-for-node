# file_cracker

Flexible file batch package, template supported.

---
## Installation

```bash
$ npm install file_cracker
```
---
## Usage

### Create File

- if file already exists, won't do anything

- if you want to create a directory, please `filename` ends with '/'

config.json

```json
[
    "aaa/bbb/",
    "ccc/1.txt",
    "2.txt"
]
```

command

```bash
$ node file_crack config.json
```

output

```bash
file created: 2.txt
file created: ccc/1.txt
directory created: aaa/bbb/
```

### Specifies Filename `With Command Line Parameters`

- {%`digit`%} specifies command line parameter

config.json

```json
[
    "aaa/{%1%}/",
    "{%2%}/x{%3%}y.txt"
]
```

command

```bash
$ node .\file_cracker.js config.json aaa bbb ccc
```

output

```bash
file created: bbb/xcccy.txt
directory created: aaa/aaa/
```

### Create File `With Template`

config.json

```json
{
    "1.txt": {
        "template": "template.txt"
    }
}
```

template.txt

```
xxx
```

command

```bash
$ node .\file_cracker.js config.json
```

output

```bash
create file: 1.txt      from template: template.txt
```

generated file

```
xxx
```

### `Rendering Template` To File

config.json

```json
{
    "1.txt": {
        "template": "template.txt",
        "dict": {
            "v1": "value1",
            "v2": "value2"
        }
    }
}
```

template.txt

```
xxx
{%1%}
{%2%}
{%3%}
{%v1%}
{%v2%}
```

command

```bash
$ node .\file_cracker.js config.json aaa bbb ccc
```

output

```bash
create file: 1.txt      from template: template.txt
```

generated file

```
xxx
aaa
bbb
ccc
value1
value2
```