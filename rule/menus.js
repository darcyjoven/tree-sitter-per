/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
import { K, NAME_KEYWORDS } from "./keywords.js";

// 菜单元素头部: [名字] [属性]; 关键字名必须紧跟属性括号,
// 且排除可能作为同级元素起始的关键字 (COMMAND/SEPARATOR/ITEM/END)。
function menuHead(/** @type {any} */ $, /** @type {any[]} */ exclude) {
  const keywordNames = NAME_KEYWORDS.filter((r) => !exclude.includes(r));
  return optional(
    choice(
      $.attr_list_paren,
      seq(field("name", $.identifier), optional($.attr_list_paren)),
      seq(
        field("name", alias(choice(...keywordNames), $.name)),
        $.attr_list_paren,
      ),
    ),
  );
}

export default {
  // ACTION DEFAULTS 小节
  action_defaults: (/** @type {any} */ $) =>
    seq(
      K.ACTION,
      K.DEFAULTS,
      repeat($.action_default_entry),
      K.END,
    ),

  action_default_entry: (/** @type {any} */ $) =>
    seq(
      K.ACTION,
      field("name", $.name),
      "(",
      $.attr_list,
      ")",
    ),

  // TOPMENU 小节
  topmenu: (/** @type {any} */ $) =>
    seq(
      K.TOPMENU,
      optional(field("name", $.identifier)),
      optional($.attr_list_paren),
      repeat($.menu_group),
      K.END,
    ),

  menu_group: (/** @type {any} */ $) =>
    seq(K.GROUP, menuHead($, [K.GROUP, K.COMMAND, K.SEPARATOR]), repeat($.menu_item), K.END),

  menu_item: (/** @type {any} */ $) =>
    choice(
      seq(K.COMMAND, menuHead($, [K.COMMAND, K.SEPARATOR])),
      seq(K.SEPARATOR, menuHead($, [K.COMMAND, K.SEPARATOR])),
    ),

  // TOOLBAR 小节
  toolbar: (/** @type {any} */ $) =>
    seq(
      K.TOOLBAR,
      optional(field("name", $.identifier)),
      optional($.attr_list_paren),
      repeat($.toolbar_item),
      K.END,
    ),

  toolbar_item: (/** @type {any} */ $) =>
    choice(
      seq(K.ITEM, menuHead($, [K.ITEM, K.SEPARATOR])),
      seq(K.SEPARATOR, menuHead($, [K.ITEM, K.SEPARATOR])),
    ),
};
