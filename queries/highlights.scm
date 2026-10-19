; Genero Form Specification (.per) — syntax highlights

; ---------------------------------------------------------------------------
; 注释 / 字符串 / 数字
; ---------------------------------------------------------------------------
(comment) @comment

(string) @string
(number) @number

; ---------------------------------------------------------------------------
; 小节与结构关键字
; ---------------------------------------------------------------------------
[
  "SCHEMA"
  "DATABASE"
  "LAYOUT"
  "SCREEN"
  "TABLES"
  "ATTRIBUTES"
  "INSTRUCTIONS"
  "KEYS"
  "ACTION"
  "DEFAULTS"
  "TOPMENU"
  "TOOLBAR"
  "END"
  "VBOX"
  "HBOX"
  "GROUP"
  "FOLDER"
  "PAGE"
  "GRID"
  "SCROLLGRID"
  "TABLE"
  "TREE"
  "PHANTOM"
  "TYPE"
  "WHERE"
  "LIKE"
  "TO"
  "AND"
  "OR"
  "NOT"
  "WITHOUT"
  "NULL"
  "INPUT"
  "SIZE"
  "BY"
  "TITLE"
  "RECORD"
  "DELIMITERS"
  "DEFAULT"
  "SAMPLE"
  "ITEM"
  "COMMAND"
  "SEPARATOR"
  "TRUE"
  "FALSE"
] @keyword

; ---------------------------------------------------------------------------
; 表单 item 类型 (EDIT / BUTTONEDIT / COMBOBOX ...)
; ---------------------------------------------------------------------------
(item_type) @type

; ---------------------------------------------------------------------------
; 名字 / 字段
; ---------------------------------------------------------------------------
(attribute name: (name) @property)
(attribute_item tag: (name) @variable)
(untyped_attribute_item tag: (identifier) @variable)
(field_ref (name) @variable)
(type_clause (datatype (name) @type))

; ---------------------------------------------------------------------------
; 布局区
; ---------------------------------------------------------------------------
(item_tag) @variable
(layout_tag) @tag
(area_text) @text
(row_separator) @punctuation.delimiter
(area_bracket) @punctuation.bracket
(area_square) @punctuation.bracket

; ---------------------------------------------------------------------------
; 运算符与标点
; ---------------------------------------------------------------------------
(bool_op) @operator
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"," @punctuation.delimiter
";" @punctuation.delimiter
"=" @operator
