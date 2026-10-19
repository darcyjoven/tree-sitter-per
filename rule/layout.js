/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
import { CONTAINER_KEYWORDS, K, NAME_KEYWORDS } from "./keywords.js";

/** 非容器关键字 (盒式容器的关键字名不能与子容器起始 token 重叠) */
function nonContainerKeywords() {
  return NAME_KEYWORDS.filter((r) => !CONTAINER_KEYWORDS.includes(r));
}

/**
 * 盒式容器头部: [名字] [属性]
 * - 普通标识符名字, 可带属性
 * - 与容器同名的关键字 (Folder folder / Page Page) 作为名字
 * - 其它关键字名必须紧跟属性括号, 避免与子容器关键字混淆
 */
function boxHeader(/** @type {any} */ $, /** @type {any} */ k) {
  return optional(
    choice(
      $.attr_list_paren,
      seq(field("name", $.identifier), optional($.attr_list_paren)),
      seq(
        field("name", alias(choice(...nonContainerKeywords()), $.name)),
        $.attr_list_paren,
      ),
      seq(field("name", alias(k, $.name)), optional($.attr_list_paren)),
    ),
  );
}

/**
 * 字符画容器头部: GRID/TABLE/TREE 的子节点只有布局区,
 * 因此关键字后面出现的关键字只可能是名字 (Grid grid / Grid group)。
 */
function gridHeader(/** @type {any} */ $) {
  return optional(
    choice(
      $.attr_list_paren,
      seq(field("name", $.identifier), optional($.attr_list_paren)),
      seq(field("name", $.name_keyword), optional($.attr_list_paren)),
    ),
  );
}

function boxRule(
  /** @type {any} */ k,
  /** @type {any} */ $,
) {
  return seq(k, boxHeader($, k), repeat($._container), K.END);
}

function gridRule(/** @type {any} */ k, /** @type {any} */ $) {
  return seq(k, gridHeader($), $.area, K.END);
}

export default {
  // 布局小节: LAYOUT (容器树) 或向后兼容的 SCREEN
  layout: (/** @type {any} */ $) =>
    choice($.layout_section, $.screen_section),

  layout_section: (/** @type {any} */ $) =>
    seq(
      K.LAYOUT,
      optional($.attr_list_paren),
      repeat($._container),
      optional(K.END),
    ),

  // 旧式定长屏幕
  screen_section: (/** @type {any} */ $) =>
    seq(
      K.SCREEN,
      optional($.screen_size),
      optional($.screen_title),
      $.area,
      optional(K.END),
    ),

  screen_size: (/** @type {any} */ $) =>
    seq(
      K.SIZE,
      field("lines", $.number),
      optional(seq(K.BY, field("chars", $.number))),
    ),

  screen_title: (/** @type {any} */ $) =>
    seq(K.TITLE, field("title", $.string)),

  // 布局容器
  _container: (/** @type {any} */ $) =>
    choice(
      $.vbox,
      $.hbox,
      $.group_container,
      $.folder,
      $.page,
      $.grid,
      $.scrollgrid,
      $.table_container,
      $.tree_container,
    ),

  vbox: (/** @type {any} */ $) => boxRule(K.VBOX, $),
  hbox: (/** @type {any} */ $) => boxRule(K.HBOX, $),
  group_container: (/** @type {any} */ $) => boxRule(K.GROUP, $),

  folder: (/** @type {any} */ $) =>
    seq(K.FOLDER, boxHeader($, K.FOLDER), repeat($.page), K.END),

  page: (/** @type {any} */ $) =>
    seq(K.PAGE, boxHeader($, K.PAGE), repeat($._container), K.END),

  grid: (/** @type {any} */ $) => gridRule(K.GRID, $),
  scrollgrid: (/** @type {any} */ $) => gridRule(K.SCROLLGRID, $),
  table_container: (/** @type {any} */ $) => gridRule(K.TABLE, $),
  tree_container: (/** @type {any} */ $) => gridRule(K.TREE, $),

  // 花括号包围的字符画布局区
  area: (/** @type {any} */ $) =>
    seq(
      "{",
      repeat(
        choice(
          $.area_text,
          $.item_tag,
          $.layout_tag,
          $.area_bracket,
          $.area_square,
          $.row_separator,
        ),
      ),
      "}",
    ),

  // 布局区中的普通文本(可含空格/中文), 到方括号/尖括号/花括号/竖线/换行为止
  area_text: (/** @type {any} */ $) =>
    token(prec(1, /[^\[\]<>{}\n|]+/)),

  // [f001   ] / [f1 - ] / ["Label": f2] 等 item tag / hbox tag
  item_tag: (/** @type {any} */ $) => token(prec(1, /\[[^\[\]\n]*\]/)),

  // <G group01   > / <   > 等 layout tag
  layout_tag: (/** @type {any} */ $) => token(prec(1, /<[^<>\n]*>/)),

  // 容错: 未配对的尖括号/方括号
  area_bracket: (/** @type {any} */ $) => choice("<", ">"),
  area_square: (/** @type {any} */ $) => choice("[", "]"),

  // TABLE 列分隔符
  row_separator: (/** @type {any} */ $) => "|",
};
