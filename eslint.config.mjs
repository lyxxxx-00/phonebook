import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  { languageOptions: { globals: globals.node } },
];
