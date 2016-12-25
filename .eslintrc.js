module.exports = {
  "parser": "babel-eslint",
  "env": {
      "browser": true
  },
  "globals": { "require": true },
  "plugins": [
      "react",
      "react-native"
  ],
  "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "rules": {
    "react/prop-types": 0,
    "no-case-declarations": 0,
    "no-console": 0,
  }
};
