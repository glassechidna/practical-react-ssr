/* @flow */

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import { browserConfig } from '../../webpack.config.babel'

const config = browserConfig({development: true})

module.exports = (app: any) => {
	const compiler = webpack(config)

	app.use(webpackDevMiddleware(compiler, {
		noInfo: true,
		hot: true,
		publicPath: config.output.publicPath,
	}))

	app.use(webpackHotMiddleware(compiler, {
		log: console.log,
		reload: true,
	}))

	return app
}
