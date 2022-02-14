module.exports = {
  provider: 'mornya',

  // Use extra additional ESLint plugins
  installPlugins: ['eslint-plugin-storybook'],

  // Overrides rules package
  overrides: {
    eslint: [
      {
        files: ['*.stories.@(ts|tsx|js|jsx|mdx)'],
        extends: ['plugin:storybook/recommended'],
        rules: {
          'storybook/default-exports': 'warn',
        },
      },
    ],
  },
};
