module.exports = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-env",
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    [
      "transform-react-remove-prop-types",
      {
        "removeImport": true,
        "additionalLibraries": ["react-style-proptype"]
      }
    ],
    'react-native-paper/babel',
    'react-native-reanimated/plugin',
    ["@babel/plugin-proposal-private-methods", { "loose": true }]
  ]
};
