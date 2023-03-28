module.exports = {
    presets: [
        "module:metro-react-native-babel-preset"
    ],
    plugins: [
        "react-native-paper/babel",
        "@babel/plugin-transform-flow-strip-types",
        ["@babel/plugin-proposal-private-methods", {loose: true}],
        ["@babel/plugin-transform-react-jsx", {runtime: "automatic"}],
        ["transform-react-remove-prop-types", {
            removeImport: true,
            additionalLibraries: ["react-style-proptype"]
        }],
    ]
};