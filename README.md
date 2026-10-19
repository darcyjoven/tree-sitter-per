# tree-sitter-per

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for **Genero Form
Specification** (`.per`) files — the declarative screen/form definition language used by
Genero BDL applications.

Companion project: [`tree-sitter-bdl`](https://github.com/darcyjoven/tree-sitter-bdl) (`.4gl` programs).

## What is a `.per` file?

A form specification file describes an application screen: its layout containers
(`GRID`, `VBOX`, `TABLE`, …), form items (`EDIT`, `BUTTONEDIT`, `COMBOBOX`, …), attributes,
screen records and menus. It is compiled by `fglform` into a `.42f` file which a `.4gl`
program loads at runtime.

Typical structure (all sections except `LAYOUT` / `ATTRIBUTES` are optional; order is fixed
by `fglform` but the grammar is tolerant):

```per
SCHEMA formonly

LAYOUT (text=%"Customer")
GRID
{
  Name:  [f1        ]
  Phone: [f2        ]
}
END
END

ATTRIBUTES
EDIT f1 = customer.cust_name, REQUIRED;
EDIT f2 = customer.phone;
END

INSTRUCTIONS
SCREEN RECORD cust(customer.cust_name, customer.phone)
END
```

## Supported syntax

| Section | Coverage |
|---|---|
| `SCHEMA` / `DATABASE` | database refs, `FORMONLY`, `WITHOUT NULL INPUT` |
| `ACTION DEFAULTS` | `ACTION name(attrs)` entries |
| `TOPMENU` / `TOOLBAR` | `GROUP` / `COMMAND` / `SEPARATOR` / `ITEM` |
| `LAYOUT` | `VBOX` `HBOX` `GROUP` `FOLDER`/`PAGE` `GRID` `SCROLLGRID` `TABLE` `TREE`, grid areas with item tags / hbox tags / layout tags |
| `SCREEN` | legacy fixed-column screens |
| `TABLES` | aliases, `db@server:owner.table` refs, optional commas |
| `ATTRIBUTES` | all 20+ item types, typed and legacy untyped definitions, `TYPE`/`LIKE`, attribute lists, `COLOR ... WHERE`, value lists |
| `INSTRUCTIONS` | `SCREEN RECORD` (records and arrays), `DELIMITERS`, `DEFAULT SAMPLE` |
| `KEYS` | key labels |

Notable lexical support: `--` / `#` comments, `%"..."` localized strings, keyword-named
fields (`Edit database = formonly.database`), keyword-prefixed identifiers (`items`).

## Build

```bash
npm install            # installs tree-sitter-cli
npx tree-sitter generate
```

## Test

```bash
npx tree-sitter test
```

Parse a single file (exit code 0 = no ERROR nodes):

```bash
npx tree-sitter parse -q path/to/form.per
```

## Node bindings

```js
import Parser from "tree-sitter";
import Per from "tree-sitter-per";

const parser = new Parser();
parser.setLanguage(Per);

const tree = parser.parse(source);
console.log(tree.rootNode.toString());
```

## Highlights

`queries/highlights.scm` and `queries/indents.scm` provide editor highlighting/indentation
for sections, item types, attributes, layout areas and comments.

## Notes / limitations

- Block comments `{ ... }` are **not** supported: they collide with layout areas. Use `--`
  or `#`.
- `LAYOUT` and `INSTRUCTIONS` sections require a closing `END` in this grammar (the manual
  allows omitting them). This keeps "missing container END" detectable; all 7070 real `.per`
  files in the validation corpus already write them.
- Inside layout areas, literal angle brackets must be escaped (`\>`, `\<`); arrows `->` / `<-`
  are allowed as text. Unclosed `[` / `<` tags are reported as `ERROR`.
- The grammar is intentionally tolerant about section ordering and optional `END`s; use
  `fglform` for authoritative validation.
- Trailing garbage after the last section is reported as `ERROR` (as in normal tree-sitter
  grammars).

## License

MIT
