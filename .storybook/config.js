import React from "react";
import { withOptions } from "@storybook/addon-options";
import { withInfo } from "@storybook/addon-info";
import centered from "@storybook/addon-centered";
import { configure, addDecorator } from "@storybook/react";
import { injectGlobal } from "emotion";

// Automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /\.stories\.tsx$/);

// Simple style reset
// injectGlobal`
//   * {
//     box-sizing: border-box;
//   }
// `

// Configure storybook view options
// addDecorator(
//   withOptions({
//     name: 'Timber Demo',
//     url: 'https://github.com/timberio/js-pkg-starter',
//     showAddonPanel: true,
//   })
// )

// Wrap stories in a theme provider
// addDecorator(story => (
//   <div>
//     {story()}
//   </div>
// ))

// Center component examples
// addDecorator(centered)

// Global configuration for the info addon across all of your stories.
// addDecorator(
//   withInfo({
//     header: false,
//     inline: false,
//     maxPropsIntoLine: 2,
//   })
// )

configure(() => req.keys().forEach(f => req(f)), module);
