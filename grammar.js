/**
 * @file Genero Form Specification (.per)
 * @author darcy <darcy_joven@live.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import commonRules from "./rule/common.js";
import layoutRules from "./rule/layout.js";
import sectionRules from "./rule/sections.js";
import menuRules from "./rule/menus.js";

export default grammar({
  name: "per",

  // 空白与注释 (-- 与 #)
  extras: ($) => [/\s/, $.comment],

  // 容器名与子容器关键字可能同名(Folder folder / VBox VBox)，
  // 允许 GLR 分支，由后续 END 数量决定正确解析。
  conflicts: ($) => [
    [$.vbox],
    [$.hbox],
    [$.group_container],
    [$.page],
  ],

  rules: {
    source_file: ($) => repeat($._section),

    // 各小节顺序不强制, 由 form 编译器校验
    _section: ($) =>
      choice(
        $.schema,
        $.layout,
        $.tables,
        $.attributes,
        $.instructions,
        $.keys,
        $.action_defaults,
        $.topmenu,
        $.toolbar,
      ),

    ...commonRules,
    ...layoutRules,
    ...sectionRules,
    ...menuRules,
  },
});
