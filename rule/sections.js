/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
import { commaSep } from "./util.js";
import { K } from "./keywords.js";

const ITEM_TYPES = [
  K.AGGREGATE,
  K.BUTTON,
  K.BUTTONEDIT,
  K.CANVAS,
  K.CHECKBOX,
  K.COMBOBOX,
  K.DATEEDIT,
  K.EDIT,
  K.FIELD,
  K.IMAGE,
  K.LABEL,
  K.PROGRESSBAR,
  K.RADIOGROUP,
  K.SCROLLGRID,
  K.SLIDER,
  K.SPINEDIT,
  K.TABLE,
  K.TEXTEDIT,
  K.TIMEEDIT,
  K.TREE,
  K.WEBCOMPONENT,
  K.GROUP,
];

export default {
  // SCHEMA / DATABASE
  schema: (/** @type {any} */ $) =>
    seq(
      choice(K.SCHEMA, K.DATABASE),
      choice(K.FORMONLY, $.string, $._db_ref),
      optional(seq(K.WITHOUT, K.NULL, K.INPUT)),
    ),

  _db_ref: (/** @type {any} */ $) =>
    seq($.identifier, repeat(seq(choice(".", "@", ":"), $.identifier))),

  // TABLES
  tables: (/** @type {any} */ $) =>
    seq(K.TABLES, repeat($.table_entry), optional(K.END)),

  table_entry: (/** @type {any} */ $) =>
    seq($._table_ref, optional(seq("=", $._table_ref)), optional(",")),

  _table_ref: (/** @type {any} */ $) =>
    seq($.identifier, repeat(seq(choice(".", "@", ":"), $.identifier))),

  // ATTRIBUTES
  attributes: (/** @type {any} */ $) =>
    seq(
      K.ATTRIBUTES,
      repeat(choice($.attribute_item, $.untyped_attribute_item, $.phantom_item)),
      optional(K.END),
    ),

  item_type: (/** @type {any} */ $) => choice(...ITEM_TYPES),

  // 带 item 类型的定义: EDIT f001 = table.col ...
  attribute_item: (/** @type {any} */ $) =>
    seq(
      $.item_type,
      field("tag", $.name),
      choice(
        seq("=", field("field", $.field_ref), optional($.type_clause)),
        seq(":", field("name", $.name)),
      ),
      optional(seq(",", $.attr_list)),
      ";",
    ),

  // 旧式省略 item 类型的定义: f001 = table.col ... (默认 EDIT)
  untyped_attribute_item: (/** @type {any} */ $) =>
    prec(
      1,
      seq(
        field("tag", $.identifier),
        choice(
          seq("=", field("field", $.field_ref), optional($.type_clause)),
          seq(":", field("name", $.name)),
        ),
        optional(seq(",", $.attr_list)),
        ";",
      ),
    ),

  phantom_item: (/** @type {any} */ $) =>
    seq(K.PHANTOM, $.field_ref, optional($.type_clause), ";"),

  type_clause: (/** @type {any} */ $) =>
    seq(
      K.TYPE,
      choice($.datatype, prec(2, seq(K.LIKE, $.field_ref))),
      optional(seq(K.NOT, K.NULL)),
    ),

  // INSTRUCTIONS
  instructions: (/** @type {any} */ $) =>
    seq(
      K.INSTRUCTIONS,
      repeat(
        choice(
          $.screen_record_entry,
          $.delimiters_entry,
          $.default_sample_entry,
        ),
      ),
      K.END,
    ),

  screen_record_entry: (/** @type {any} */ $) =>
    seq(
      K.SCREEN,
      K.RECORD,
      field("name", $.name),
      optional(seq("[", field("size", $.number), "]")),
      optional(seq("(", commaSep($.field_ref), ")")),
      optional(";"),
    ),

  delimiters_entry: (/** @type {any} */ $) =>
    seq(K.DELIMITERS, field("value", $.string), optional(";")),

  default_sample_entry: (/** @type {any} */ $) =>
    seq(K.DEFAULT, K.SAMPLE, "=", field("value", $.string), optional(";")),

  // KEYS
  keys: (/** @type {any} */ $) =>
    seq(K.KEYS, repeat($.key_entry), optional(K.END)),

  key_entry: (/** @type {any} */ $) =>
    seq(field("key", $.key_name), "=", field("label", $.string), optional(";")),

  key_name: (/** @type {any} */ $) =>
    seq($.identifier, repeat(seq("-", $.identifier))),
};
