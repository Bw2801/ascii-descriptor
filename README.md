# ascii-descriptor
A javascript/node library for creating data descriptions using monospace border symbols.

**Note**: If all you want is just to generate a single ascii description, you can use my online tool (TBD).

## Getting Started

TBD

## Examples

```
52 49 46 46 XX XX XX XX
└┬────────┘ └┬────────┘
 │           └─ Content Length
 └───────────── Start Sequence
```

If desired, the label indentation can be disabled.

```
https://github.benedikt.dev
└┬─────┘└┬────┘└┬──────┘└┬┘
 │       │      │        Top-level domain
 │       │      Domain name
 │       Subdomain
 Protocol
```

If the labels are short enough, they can fit on the same line when not indented.

```
This statement is false. This is another sentence.
└┬─────────────────────┘ └┬──────────────────────┘
 Paradox                  Not a paradox
```

Custom ascii character sets and insersecting sections are supported as well.

```
https://benedikt.dev/some/dir?key=value
╘╤══════│══════════││═══════││════════╡
 │      ╘╤═════════╛╘╤══════╛╘╤═══════╛
 │       │           │        ╘═ Query
 │       │           ╘══════════ Path
 │       ╘══════════════════════ Domain
 ╘══════════════════════════════ URL
```
