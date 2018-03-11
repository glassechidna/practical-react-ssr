/* @flow */

try {
	const dotenv = require('dotenv')
	dotenv.load()
	dotenv.load({path: `.env.${process.env.NODE_ENV || ''}`})
} catch (e) {
	/* Do nothing */
}

if (process.env.NODE_ENV === 'development') {
	require('css.escape')
}

// Universal constants - these are compile-time constants for the browser bundle
global.__SERVER_HOST__ = `${process.env.HOSTNAME || 'undefined'}:${process.env.PORT || 'undefined'}`
