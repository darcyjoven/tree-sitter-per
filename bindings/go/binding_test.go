package tree_sitter_per_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_per "github.com/darcyjoven/tree-sitter-per/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_per.Language())
	if language == nil {
		t.Errorf("Error loading Genero Form Specification grammar")
	}
}
