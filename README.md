# unicode-descriptor
A javascript/node library for creating text descriptions using unicode border symbols.

**Note**: If all you want is just to generate a single descriptor right now, you can use [my online tool](https://benedikt.dev/unicode-descriptor/).

Example usage: Check out the source code of my [unicode-descriptor-tool](https://github.com/Bw2801/unicode-descriptor-tool).

## Getting Started

Install the package using npm/yarn:

```sh
npm install unicode-descriptor
# or
yarn add unicode-descriptor
```

The built library lies in `dist/unicode-descriptor.js`.

## Usage

```javascript
var descriptor = new UnicodeDescriptor();

descriptor.addSection(0, 5, 'Section A');
descriptor.addSection(6, 5, 'Section B');
descriptor.addSection(12, 5, 'Section C');

console.log(descriptor.toString());
```

Result:

```
Lorem ipsum dolor
└┬──┘ └┬──┘ └┬──┘
 │     │     └─ Section C
 │     └─────── Section B
 └───────────── Section A
```

### Configuration

You can pass a configuration object to the constructor of the descriptor.

#### `indentLabels`

Type: `boolean`

Determines whether to indent the labels to the right. Defaults to `true`.
If set to `false`, the labels will be displayed in a single line if possible.

```
https://github.benedikt.dev
└┬─────┘└┬────┘└┬──────┘└┬┘
 │       │      │        Top-level domain
 │       │      Domain name
 │       Subdomain
 Protocol
```

```
This statement is false. This is another sentence.
└┬─────────────────────┘ └┬──────────────────────┘
 Paradox                  Not a paradox
```

#### `characters`

Type: `object`

Contains the characters to be used. The following table contains the required and default values.

| Key | Description | Default Value |
| --- | ----------- | ------------- |
| `hl` | Horizontal Line | `─` |
| `vl` | Vertical Line | `│` |
| `ctl` | Corner Top Left | `┘` |
| `ctr` | Corner Top Right | `└` |
| `tt` | T-Top | `┴` |
| `tb` | T-Bottom | `┬` |
| `tr` | T-Right | `├` |
| `tl` | T-Left | `┤` |
| `cross` | Cross | `┼` |

Example with intersecting sections:

```
https://benedikt.dev/some/dir?key=value
╘╤══════│══════════││═══════││════════╡
 │      ╘╤═════════╛╘╤══════╛╘╤═══════╛
 │       │           │        ╘═ Query
 │       │           ╘══════════ Path
 │       ╘══════════════════════ Domain
 ╘══════════════════════════════ URL
```
