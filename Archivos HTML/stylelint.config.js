{
	"rules": {
		"color-no-invalid-hex": true,
		"color-hex-case": "lower",
		"font-family-name-quotes": "always-where-recommended",
		"function-parentheses-space-inside": "never",
		"length-zero-no-unit": true,
		"unit-whitelist": [ "em", "rem", "%", "s", "px", "deg" ],
		"unit-case": "lower",
		"unit-no-unknown": true,
		"value-keyword-case": ["lower", {
			"ignoreKeywords": ["ButtonText"]
		}],
		"value-list-comma-space-after": "always",
		"property-case": "lower",
		"property-no-unknown": true,
		"keyframe-declaration-no-important": true,
		"declaration-bang-space-before": "always",
		"declaration-colon-space-after": "always",
		"declaration-property-unit-whitelist": {
			"font-size": ["rem", "em", "px", "%"],
			"/^animation/": ["s"]
		},
		"declaration-block-no-duplicate-properties": [true, {
			"ignore": ["consecutive-duplicates"],
			"ignoreProperties": ["transition"]
		}],
		"declaration-block-no-redundant-longhand-properties": true,
		"declaration-block-no-shorthand-property-overrides": true,
		"declaration-block-semicolon-newline-after": "always",
		"declaration-block-single-line-max-declarations": 1,
		"declaration-block-trailing-semicolon": "always",
		"block-no-empty": true,
		"block-no-single-line": true,
		"selector-attribute-brackets-space-inside": "never",
		"selector-attribute-operator-space-after": "never",
		"selector-attribute-operator-space-before": "never",
		"selector-attribute-quotes": "always",
		"selector-descendant-combinator-no-non-space": true,
		"selector-max-compound-selectors": 4,
		"selector-max-specificity": "1,0,0",
		"selector-pseudo-class-case": "lower",
		"selector-pseudo-class-no-unknown": true,
		"selector-pseudo-class-parentheses-space-inside": "never",
		"selector-pseudo-element-case": "lower",
		"selector-pseudo-element-colon-notation": "double",
		"selector-pseudo-element-no-unknown": true,
		"selector-type-case": "lower",
		"selector-type-no-unknown": true,
		"comment-no-empty": true,
		"no-empty-source": true,
		"no-eol-whitespace": true,
		"no-extra-semicolons": true,
		"no-invalid-double-slash-comments": true,
		"no-unknown-animations": true
	}
}