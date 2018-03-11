require('@babel/register')

const cssRequireHook = require('css-modules-require-hook')

cssRequireHook({
	generateScopedName: '[path][name]__[local]--[hash:base64:5]',
})

// Constants (typically compile-time string substituted)
global.__BROWSER__ = false
global.__SERVER__ = true

require('../src/server/index')
