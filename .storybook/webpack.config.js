const path = require("path");
const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");

// For TypeScript support
module.exports = (baseConfig, env, defaultConfig) => {
  // Use typescript loader
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("awesome-typescript-loader")
  });

  // Load markdown files
  defaultConfig.module.rules.push({
    test: /\.(md|mkd)$/,
    use: "raw-loader"
  });

  // Use TSDoc plugin
  defaultConfig.plugins.push(new TSDocgenPlugin());

  // Resolve typescript extensions
  defaultConfig.resolve.extensions.push(".ts", ".tsx");

  // Support absolute importa from './src'
  defaultConfig.resolve.modules = [
    ...(defaultConfig.resolve.modules || []),
    path.resolve("./src")
  ];

  // Return the updated config
  return defaultConfig;
};
