import antfu from "@antfu/eslint-config";

export default antfu({
  ignores: ["types/database.types.ts"],
  stylistic: {
    overrides: {
      "style/quotes": ["error", "double"],
      "style/semi": ["error", "always"],
    },
  },
}, {
  rules: {
    "no-console": ["warn"],
  },
});
