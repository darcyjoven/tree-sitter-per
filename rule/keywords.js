/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
import { kw } from "./util.js";

/**
 * 全语法唯一的关键字 token 定义。
 *
 * 关键: 每个关键字只调用一次 kw()。若在不同规则里重复调用 kw("EDIT"),
 * tree-sitter 会为同一文本生成多个 token 符号(如 edit_token1 / name_token8),
 * 词法只能命中其中一个, 从而产生无法收敛的 LR 冲突。
 */
export const K = {
  // 小节
  SCHEMA: kw("SCHEMA"),
  DATABASE: kw("DATABASE"),
  LAYOUT: kw("LAYOUT"),
  SCREEN: kw("SCREEN"),
  TABLES: kw("TABLES"),
  ATTRIBUTES: kw("ATTRIBUTES"),
  INSTRUCTIONS: kw("INSTRUCTIONS"),
  KEYS: kw("KEYS"),
  ACTION: kw("ACTION"),
  DEFAULTS: kw("DEFAULTS"),
  TOPMENU: kw("TOPMENU"),
  TOOLBAR: kw("TOOLBAR"),
  END: kw("END"),
  FORMONLY: kw("FORMONLY"),

  // 布局容器
  VBOX: kw("VBOX"),
  HBOX: kw("HBOX"),
  GROUP: kw("GROUP"),
  FOLDER: kw("FOLDER"),
  PAGE: kw("PAGE"),
  GRID: kw("GRID"),
  SCROLLGRID: kw("SCROLLGRID"),
  TABLE: kw("TABLE"),
  TREE: kw("TREE"),

  // item 类型
  AGGREGATE: kw("AGGREGATE"),
  BUTTON: kw("BUTTON"),
  BUTTONEDIT: kw("BUTTONEDIT"),
  CANVAS: kw("CANVAS"),
  CHECKBOX: kw("CHECKBOX"),
  COMBOBOX: kw("COMBOBOX"),
  DATEEDIT: kw("DATEEDIT"),
  EDIT: kw("EDIT"),
  FIELD: kw("FIELD"),
  IMAGE: kw("IMAGE"),
  LABEL: kw("LABEL"),
  PROGRESSBAR: kw("PROGRESSBAR"),
  RADIOGROUP: kw("RADIOGROUP"),
  SLIDER: kw("SLIDER"),
  SPINEDIT: kw("SPINEDIT"),
  TEXTEDIT: kw("TEXTEDIT"),
  TIMEEDIT: kw("TIMEEDIT"),
  WEBCOMPONENT: kw("WEBCOMPONENT"),
  PHANTOM: kw("PHANTOM"),

  // 菜单
  COMMAND: kw("COMMAND"),
  SEPARATOR: kw("SEPARATOR"),
  ITEM: kw("ITEM"),

  // 指令
  RECORD: kw("RECORD"),
  DELIMITERS: kw("DELIMITERS"),
  DEFAULT: kw("DEFAULT"),
  SAMPLE: kw("SAMPLE"),

  // 其他保留字
  SIZE: kw("SIZE"),
  BY: kw("BY"),
  TITLE: kw("TITLE"),
  TYPE: kw("TYPE"),
  WHERE: kw("WHERE"),
  LIKE: kw("LIKE"),
  TO: kw("TO"),
  AND: kw("AND"),
  OR: kw("OR"),
  NOT: kw("NOT"),
  NULL: kw("NULL"),
  WITHOUT: kw("WITHOUT"),
  INPUT: kw("INPUT"),
  TRUE: kw("TRUE"),
  FALSE: kw("FALSE"),

  // 尺寸单位 (HEIGHT = 300 PIXELS 等)
  PIXELS: kw("PIXELS"),
  POINTS: kw("POINTS"),
  LINES: kw("LINES"),
  CHARACTERS: kw("CHARACTERS"),
  COLUMNS: kw("COLUMNS"),

  // DATETIME / INTERVAL 限定词
  YEAR: kw("YEAR"),
  MONTH: kw("MONTH"),
  DAY: kw("DAY"),
  HOUR: kw("HOUR"),
  MINUTE: kw("MINUTE"),
  SECOND: kw("SECOND"),
  FRACTION: kw("FRACTION"),
};

/** 布局容器关键字 (用于排除与子容器起始 token 冲突的名字) */
export const CONTAINER_KEYWORDS = [
  K.VBOX,
  K.HBOX,
  K.GROUP,
  K.FOLDER,
  K.PAGE,
  K.GRID,
  K.SCROLLGRID,
  K.TABLE,
  K.TREE,
];

/** 可作为名字(.per 字段/属性常与关键字同名)出现的关键字; END 除外。 */
export const NAME_KEYWORDS = Object.entries(K)
  .filter(([name]) => name !== "END")
  .map(([, rule]) => rule);
