/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const digit = /[0-9]/;

// 已登记的关键字单词(单字, 大写): 供构造"以关键字开头的标识符"词边界正则。
// 必须在任何 kw() 调用之前初始化。
const KEYWORD_WORDS = new Set();

const integerLiterals = seq(optional(choice("+", "-")), repeat1(digit));
const decimalLiterals = seq(
  optional(choice("+", "-")),
  repeat(digit),
  ".",
  repeat1(digit),
  optional(seq(choice("e", "E"), optional(choice("-", "+")), repeat1(digit))),
);
const datetimeQualifier = choice(
  kw("YEAR"),
  kw("MONTH"),
  kw("DAY"),
  kw("HOUR"),
  kw("MINUTE"),
  kw("SECOND"),
  seq(kw("FRACTION"), optional(seq("(", /[1-5]/, ")"))),
);

/**
 * 用逗号将1个或者多个规则拼接
 * @param {Rule} rule
 * @returns {SeqRule}
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

/**
 * 用逗号将0个或者多个规则拼接
 * @param {Rule} rule
 * @returns {ChoiceRule}
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}

/** 大小写不敏感字符类序列: COUNT -> [cC][oO][uU][nN][tT] */
function caseInsensitivePattern(/** @type {string} */ word) {
  return word
    .split("")
    .map((c) => `[${c.toLowerCase()}${c.toUpperCase()}]`)
    .join("");
}

function makeToken(/** @type {string} */ word) {
  KEYWORD_WORDS.add(word.toUpperCase());
  return token(prec(10, new RegExp(caseInsensitivePattern(word))));
}

/**
 * 构造"以关键字开头、且严格更长"的标识符正则 (count1 / counter / items)。
 * 关键字令牌 prec=10, 词法会优先命中更短的匹配; 该情形需更高优先级(prec 11)单独声明。
 * @returns {RegExp}
 */
function keywordPrefixedIdentifier() {
  const alts = [...KEYWORD_WORDS]
    .sort((a, b) => b.length - a.length)
    .map(caseInsensitivePattern);
  return new RegExp(`(?:${alts.join("|")})[A-Za-z0-9_\u4E00-\u9FFF]+`);
}

/**
 * 将短语转为不区分大小写的 Tree-sitter 序列
 * @param {string} phrase - 例如 "END IF" 或 "ACTION DEFAULTS"
 * @returns {Rule}
 */
function kw(phrase) {
  const p = phrase.toUpperCase().trim();
  const words = p.split(/\s+/);

  if (words.length > 1) {
    const _alias = p.replace(/\s+/g, "_");
    return alias(
      prec(10, seq(...words.map((w) => kw(w)))),
      _alias,
    );
  }

  return alias(makeToken(p), p);
}

export {
  digit,
  integerLiterals,
  decimalLiterals,
  datetimeQualifier,
  commaSep,
  commaSep1,
  kw,
  keywordPrefixedIdentifier,
};
