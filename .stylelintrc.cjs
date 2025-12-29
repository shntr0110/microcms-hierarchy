module.exports = {
  plugins: ['stylelint-plugin-logical-css', 'stylelint-root-colors', 'stylelint-order'],
  extends: ['taks-stylelint-order', 'stylelint-config-recommended-scss'],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['import']
      }
    ],
    'at-rule-property-required-list': {
      'font-face': ['font-family', 'src']
    },
    'block-no-empty': null,
    'color-hex-alpha': 'never',
    'color-named': 'never',
    'custom-property-pattern': /^_?([a-zA-Z][a-zA-Z0-9]*)(-[a-z0-9]+)*$/,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['/^grid.+/', '/overflow/']
      }
    ],
    'declaration-property-unit-allowed-list': {
      'line-height': []
    },
    'unit-disallowed-list': [
      [
        'ex',
        'ch',
        'mm',
        'q',
        'cm',
        'in',
        'pt',
        'pc',
        'vm',
        's',
        'grad',
        'rad',
        'turn',
        'vw',
        'vh',
        'vi',
        'vb',
        'vmin',
        'vmax'
      ],
      {
        message: (unit) => {
          const recommendationMap = {
            ex: 'em, rem',
            ch: 'em, rem',
            mm: 'px',
            q: 'px',
            cm: 'px',
            in: 'px',
            pt: 'px',
            pc: 'px',
            grad: 'deg',
            rad: 'deg',
            turn: 'deg',
            vw: 'svw, dvw, lvw',
            vh: 'svh, dvh, lvh',
            vi: 'svi, dvi, lvi',
            vb: 'svb, dvb, lvb',
            vmin: 'svmin, dvmin, lvmin',
            vmax: 'svmax, dvmax, lvmax'
          }
          return `\`${unit}\`は使用しないでください。代わりに\`${recommendationMap[unit]}\`を検討してください。`
        },
        severity: 'warning'
      }
    ],
    'declaration-property-value-disallowed-list': [
      {
        display: [
          /* @see https://drafts.csswg.org/css-display/#display-value-summary */
          'block',
          'flow-root',
          'inline',
          'inline-block',
          'list-item',
          'inline list-item',
          'flex',
          'inline-flex',
          'grid',
          'inline-grid',
          'ruby',
          'table',
          'inline-table'
        ],
        'z-index': ['/^-?\\d+$/'],
        '/^(?:color|background|background-color|border|border-color|outline|outline-color)$/': [
          /#[0-9a-f]{3}/,
          /(?:rgb|hsl)a?\(.+?\)/
        ],
        content: [/^"\\[0-9a-f]{1,6}"$/i]
      },
      {
        message: (name, value) => {
          switch (name) {
            case 'display': {
              let multiValue = ''
              switch (value) {
                case 'block': {
                  multiValue = 'block flow'
                  break
                }
                case 'flow-root': {
                  multiValue = 'block flow-root'
                  break
                }
                case 'inline': {
                  multiValue = 'inline flow'
                  break
                }
                case 'inline-block': {
                  multiValue = 'inline flow-root'
                  break
                }
                case 'list-item': {
                  multiValue = 'block flow list-item'
                  break
                }
                case 'inline list-item': {
                  multiValue = 'inline flow list-item'
                  break
                }
                case 'flex': {
                  multiValue = 'block flex'
                  break
                }
                case 'inline-flex': {
                  multiValue = 'inline flex'
                  break
                }
                case 'grid': {
                  multiValue = 'block grid'
                  break
                }
                case 'inline-grid': {
                  multiValue = 'inline grid'
                  break
                }
                case 'ruby': {
                  multiValue = 'inline ruby'
                  break
                }
                case 'table': {
                  multiValue = 'block table'
                  break
                }
                case 'inline-table': {
                  multiValue = 'inline table'
                  break
                }
              }
              return `\`${value}\`の代わりに複数キーワード構文\`${multiValue}\`を使用してください。`
            }
            case 'z-index': {
              return `\`${name}\`はグローバルで定義されたCSS変数を使用してください。`
            }
            case 'content': {
              return `Unicode値\`${value}\`を直接指定せず、代わりに命名されたエンティティ（例: &copy;）またはCSS変数を使用してください。`
            }
            default: {
              return `ハードコードされた値\`${value}\`の代わりにCSS変数を使用してください。`
            }
          }
        },
        severity: 'warning'
      }
    ],
    'font-weight-notation': 'numeric',
    'function-url-no-scheme-relative': true,
    'media-feature-name-value-no-unknown': true,
    'no-descending-specificity': null,
    'order/order': [
      [
        'custom-properties',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports',
          hasBlock: true
        },
        {
          type: 'at-rule',
          name: 'container',
          hasBlock: true
        },
        {
          type: 'at-rule',
          name: 'media',
          hasBlock: true
        },
        {
          type: 'at-rule',
          name: 'starting-style',
          hasBlock: true
        },
        'rules'
      ],
      { unspecified: 'bottom' }
    ],
    'plugin/root-colors': true,
    'plugin/use-logical-properties-and-values': [
      true,
      {
        ignore: ['overflow-x', 'overflow-y'],
        severity: 'warning'
      }
    ],
    'plugin/use-logical-units': [
      true,
      {
        severity: 'warning'
      }
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['field-sizing', 'reading-flow', 'navigation', 'interactivity', 'interpolate-size']
      }
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['backdrop-filter', 'text-size-adjust', 'box-decoration-break']
      }
    ],
    'selector-class-pattern': null,
    'selector-max-id': 0,
    'selector-max-universal': [
      1,
      {
        ignoreAfterCombinators: ['+']
      }
    ],
    'selector-nested-pattern': /&/,
    'selector-pseudo-element-colon-notation': 'double',
    'value-keyword-case': [
      'lower',
      {
        camelCaseSvgKeywords: true
      }
    ],
    'scss/operator-no-newline-before': null,
    'scss/operator-no-newline-after': null,
    'scss/no-global-function-names': null
  },
  overrides: [
    {
      files: ['*.astro', '**/*.astro'],
      customSyntax: 'postcss-html',
      rules: {
        // 次の擬似クラスの使用を許可
        // :global()
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global']
          }
        ]
      }
    }
  ],
  ignoreFiles: ['**/node_modules/**']
}
