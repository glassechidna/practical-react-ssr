/* @flow */

import path from 'path'

import {
	DefinePlugin,
	HotModuleReplacementPlugin,
	IgnorePlugin,
	optimize,
} from 'webpack'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import webpackNodeExternals from 'webpack-node-externals'

const SERVER_HOST = process.env.SERVER_HOST || 'http://localhost:8080'

const fileExtensions = {
	fonts: [
		'eot',
		'otf',
		'ttf',
		'woff',
		'woff2',
	],
	images: [
		'gif',
		'jpeg',
		'jpg',
		'png',
		'svg',
	],
	styleSheets: ['css'],
}

const commonRules = [
	{
		test: /.js$/,
		exclude: [/node_modules/],
		use: [
			{
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
					presets: [
						'@babel/env',
						'@babel/flow',
						'@babel/react',
					],
					plugins: [
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-syntax-import-meta',
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-json-strings',
						'@babel/transform-runtime',
						'react-hot-loader/babel',
					],
				},
			},
		],
	},
	{
		test: /.js$/,
		include: [/node_modules\/rc/],
		use: [
			{
				loader: 'shebang-loader',
			},
		],
	},
]

export const serverConfig = (env: Object, argv?: any[]) => {
	env = env || {}

	return {
		mode: env.production ? 'production' : 'development',
		entry: './src/server/index.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'server.js',
			libraryTarget: 'umd',
		},
		plugins: [
			new DefinePlugin({
				'global.__BROWSER__': JSON.stringify(false),
				'global.__SERVER__': JSON.stringify(true),
			}),
		],
		target: 'node',
		module: {
			rules: [
				...commonRules,
				{
					test: new RegExp(`\.(${[...fileExtensions.fonts, ...fileExtensions.images].join('|')})$`),
					use: [
						{
							loader: 'null',
						},
					],
				},
				{
					test: new RegExp(`\.(${fileExtensions.styleSheets.join('|')})$`),
					use: [
						{
							loader: 'css-loader/locals',
							options: {
								modules: true,
								localIdentName: '[path][name]__[local]--[hash:base64:5]',
							},
						},
					],
				},
			],
		},
		externals: [webpackNodeExternals({
			whitelist: [
				function(module) {
					return /\.(?!(?:jsx?|json)$).{1,5}$/i.exec(require.resolve(module))
				},
			],
		})],
		devtool: env.production ? 'source-maps' : 'eval-source-map',
		devServer: {
			contentBase: path.join(__dirname, 'dist'),
		},
	}
}

export const browserConfig = (env: Object, argv?: any[]) => {
	env = env || {}

	return {
		mode: env.production ? 'production' : 'development',
		entry: [
			...(env.production ? [] : [
				'react-hot-loader/patch',
				'webpack-hot-middleware/client?noInfo=false',
			]),
			'./src/browser/index.js',
		],
		output: {
			path: path.resolve(__dirname, 'dist', 'static'),
			filename: 'bundle.js',
			publicPath: '/static/',
			...(env.production ? {} : {
				crossOriginLoading: 'anonymous',
			}),
		},
		plugins: [
			new DefinePlugin({
				'global.__BROWSER__': JSON.stringify(true),
				'global.__SERVER__': JSON.stringify(false),
				'global.__SERVER_HOST__': JSON.stringify(SERVER_HOST),
				'process.env.NODE_ENV': JSON.stringify(env.production ? 'production' : 'development'),
				...(env.production ? {'module.hot': JSON.stringify(false)} : {}),
			}),
			new ExtractTextPlugin('styles.css'),
			...(env.production ? [] : [
				new HotModuleReplacementPlugin(),
			]),
			...(env.production ? [
				new optimize.AggressiveMergingPlugin(),
			] : []),
			...(env.analyze ? [
				new BundleAnalyzerPlugin(),
			] : []),
		],
		module: {
			rules: [
				...commonRules,
				{
					test: new RegExp(`\.(${[...fileExtensions.fonts, ...fileExtensions.images].join('|')})$`),
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
								fallback: 'file-loader',
							},
						},
					],
				},
				{
					test: new RegExp(`\.(${fileExtensions.styleSheets.join('|')})$`),
					loaders: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: true,
									localIdentName: '[path][name]__[local]--[hash:base64:5]',
								},
							},
						],
					}),
				},
			],
		},
		devtool: env.production ? 'source-maps' : 'cheap-module-source-map',
		devServer: {
			contentBase: path.join(__dirname, 'dist', 'static'),
		},
	}
}

export default [serverConfig, browserConfig]
