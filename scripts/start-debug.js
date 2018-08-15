require('@babel/register')

const fileExtensions = require('../webpack.config.babel').fileExtensions

const cssRequireHook = require('css-modules-require-hook')
const assetRequireHook = require('asset-require-hook')

cssRequireHook({
	generateScopedName: '[path][name]__[local]--[hash:base64:5]',
})

assetRequireHook({
	extensions: [
		...fileExtensions.images,
		...fileExtensions.fonts,
	],
	publicPath: '/static/',
	limit: 8192,
})

// Constants (typically compile-time string substituted)
global.__BROWSER__ = false
global.__SERVER__ = true

require('../src/server/index')
