import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    overrides: {
      "style/quotes": ["error", "double"],
      "style/semi": ["error", "always"],
    },
  },
  rules: {
    "no-console": ["warn"],
  },
});
