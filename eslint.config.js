import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    typescript: true,
    ignores: [
    ],
  },
  {
    rules: {
      // Allow trailing space in comments, for possible JSDoc formattings
      'style/no-trailing-spaces': ['error', { ignoreComments: true }],
      // Relaxes inline statements a bit
      'style/max-statements-per-line': ['error', { max: 2 }],
      // Allow top-level await
      'antfu/no-top-level-await': 'off',
    },
  },
  // Allow trailing space for markdown formatting
  {
    files: ['**/*.md'],
    rules: {
      // // Experimental: allow multiple empty lines, this reduce conflicts AI Agents docs edits.
      // 'style/no-multiple-empty-lines': 'off',
      'style/no-trailing-spaces': 'off',
    },
  },
)
