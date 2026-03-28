export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [
      true,
      { ignoreAtRules: ["theme", "layer", "utility", "variant"] },
    ],
    "import-notation": "string",
    "value-keyword-case": [
      "lower",
      { camelCaseSvgKeywords: true, ignoreKeywords: ["Georgia", "Inter"] },
    ],
  },
};
