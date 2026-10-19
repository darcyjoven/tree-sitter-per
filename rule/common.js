/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
import {
  commaSep,
  commaSep1,
  decimalLiterals,
  integerLiterals,
  keywordPrefixedIdentifier,
} from "./util.js";
import { K, NAME_KEYWORDS } from "./keywords.js";

const plainIdentifier =
  /[a-zA-Z_\u4E00-\u9FFF][a-zA-Z0-9_\u4E00-\u9FFF]*/;

export default {
  // 行注释: -- 与 # (块注释 { } 与布局区冲突, 不在此支持)
  // 另兼容旧文件尾部的 ▼---- 装饰行(非 fglform 语法)
  comment: (/** @type {any} */ $) =>
    token(
      choice(
        seq("--", /[^\n]*/),
        seq("#", /[^\n]*/),
        seq("▼", /[^\n]*/),
      ),
    ),

  // 严格标识符: 用于小节边界等不能吞掉关键字的位置(表名、容器名等)
  identifier: (/** @type {any} */ $) =>
    token(choice(prec(11, keywordPrefixedIdentifier()), plainIdentifier)),

  // 宽松名字: 字段名/属性名/属性值等位置, 允许关键字
  name: (/** @type {any} */ $) => choice($.identifier, ...NAME_KEYWORDS),

  // 仅关键字构成的名字(用于容器头等需要与"子容器关键字"区分的位置)
  name_keyword: (/** @type {any} */ $) => choice(...NAME_KEYWORDS),

  // 字面值
  literal: (/** @type {any} */ $) => choice($.string, $.number),

  // 字符串, 支持 %"..." 本地化字符串与单/双引号
  string: (/** @type {any} */ $) =>
    token(
      prec(
        2,
        choice(
          seq(optional("%"), '"', repeat(choice(/[^"\\]/, /\\./, '""')), '"'),
          seq(optional("%"), "'", repeat(choice(/[^'\\]/, /\\./, "''")), "'"),
        ),
      ),
    ),

  number: (/** @type {any} */ $) =>
    token(choice(integerLiterals, decimalLiterals)),

  // 字段引用: column | table.column | table.*
  field_ref: (/** @type {any} */ $) =>
    seq($.name, optional(seq(".", field("column", choice($.name, "*"))))),

  // 属性值
  value: (/** @type {any} */ $) =>
    choice(
      $.multiword_value,
      $.string,
      $.value_list,
      $.key_value,
      $.number_with_unit,
      $.name,
    ),

  // 多词值: COLOR = BLACK REVERSE (颜色 + 强度)
  multiword_value: (/** @type {any} */ $) =>
    prec(2, seq($.identifier, repeat1($.identifier))),

  // 加速键等连字符值: CONTROL-P / SHIFT-F2
  key_value: (/** @type {any} */ $) =>
    prec(1, seq($.name, repeat1(seq("-", $.name)))),

  // 带单位的数值: 300 PIXELS / 5 COLUMNS / 10 LINES
  number_with_unit: (/** @type {any} */ $) =>
    prec(
      1,
      seq(
        $.number,
        optional(choice(K.PIXELS, K.POINTS, K.LINES, K.CHARACTERS, K.COLUMNS)),
      ),
    ),

  // 值列表: (1,2,3) / (("1","A"),("2","B")) / (1 TO 10)
  value_list: (/** @type {any} */ $) =>
    seq("(", commaSep1($._value_item), ")"),

  _value_item: (/** @type {any} */ $) =>
    choice(
      $.value_list,
      // WEBCOMPONENT PROPERTIES 风格的键值对: (data = %"", charttype = %"")
      seq($.name, "=", $.value),
      seq(
        choice($.literal, $.name),
        optional(seq(K.TO, choice($.literal, $.name))),
      ),
    ),

  // 单个属性: NAME [= value] [LIKE field] [WHERE boolexpr]
  attribute: (/** @type {any} */ $) =>
    choice(
      // 多词属性: NOT NULL
      seq(K.NOT, K.NULL),
      seq(
        field("name", $.name),
        optional(seq("=", field("value", $.value))),
        optional(seq(K.LIKE, $.field_ref)),
        optional(seq(K.WHERE, $.boolexpr)),
      ),
    ),

  attr_list: (/** @type {any} */ $) => commaSep1($.attribute),

  attr_list_paren: (/** @type {any} */ $) => seq("(", $.attr_list, ")"),

  // 条件表达式 (COLOR ... WHERE)
  boolexpr: (/** @type {any} */ $) =>
    choice(
      $.bool_primary,
      prec.left(1, seq($.boolexpr, K.AND, $.boolexpr)),
      prec.left(2, seq($.boolexpr, K.OR, $.boolexpr)),
      prec(3, seq("(", $.boolexpr, ")")),
    ),

  bool_primary: (/** @type {any} */ $) =>
    seq(
      choice($.field_ref, $.number, $.string),
      $.bool_op,
      choice($.field_ref, $.number, $.string),
    ),

  // 比较运算符: 直接用匿名字符串 token, 避免与 "=" 产生重复 token
  bool_op: (/** @type {any} */ $) =>
    choice("=", "<>", "!=", ">=", "<=", ">", "<"),

  // 数据类型 (TYPE 子句): CHAR / VARCHAR(20) / DECIMAL(10,2) / DATETIME YEAR TO SECOND
  datatype: (/** @type {any} */ $) =>
    seq(
      field("type", $.name),
      optional(seq("(", commaSep1($.number), ")")),
      optional($._datetime_range),
    ),

  _datetime_range: (/** @type {any} */ $) =>
    seq(
      field("from", $.datetime_qualifier),
      optional(seq("(", $.number, ")")),
      K.TO,
      field("to", $.datetime_qualifier),
      optional(seq("(", $.number, ")")),
    ),

  datetime_qualifier: (/** @type {any} */ $) =>
    choice(K.YEAR, K.MONTH, K.DAY, K.HOUR, K.MINUTE, K.SECOND, K.FRACTION),
};
