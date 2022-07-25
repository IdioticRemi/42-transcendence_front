
const settings = [
  "plugin:vue/vue3-essential",
  "eslint:recommended",
  "@vue/typescript/recommended",
];

if (process.env.NODE_ENV === "production") {
  settings.push("plugin:prettier/recommended")
}

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: settings,
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};