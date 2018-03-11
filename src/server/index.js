/* @flow */

import './env'


import Express from 'express'

import cookieSession from 'cookie-session'

import { json as jsonParser, urlencoded as urlEncodingParser } from 'body-parser'

import React from 'react'
import { renderToString } from 'react-dom/server'

import { AppContainer } from 'react-hot-loader'

import { Provider } from 'react-redux'

import { matchPath } from 'react-router'

import serialize from 'serialize-javascript'

import createHistory from 'history/createMemoryHistory'

import createStore from '../store'

import { create as createJss } from 'jss'
import jssPreset from 'jss-preset-default'
import JssProvider from 'react-jss/lib/JssProvider'
import { SheetsRegistry } from 'react-jss/lib/jss'


import styles from './index.css'

import './db'

import App from '../app'

import api from './api' // Non-react routes
import routes, { flattenRoutes } from './routes'

import { passport, session } from './authentication/passport'


import type { $Request, $Response, NextFunction } from 'express'
import type { Route } from 'react-router'

import type { AppState } from '../reducers'


const PROD = process.env.NODE_ENV === 'production'

const app = Express()
const port = parseInt(process.env.PORT || 8080)

const flattenedRoutes = flattenRoutes(routes)

function renderHtml(html: string, css: string, preloadedState: AppState, title = 'Glass Echidna React SSR Template') {
	return `
	<!doctype html>
	<html>
		<head>
			<title>${title}</title>
			<link rel='stylesheet' href='/static/styles.css'>
		</head>
		<body>
			<div id='root' class=${styles.root}>${html}</div>
			<style id="preloaded-jss">${css}</style>
			<script>
				window.__PRELOADED_STATE__ = ${serialize(preloadedState, {isJSON: true})}
			</script>
			<script src='/static/bundle.js'></script>
		</body>
	</html>
	`
}

function render(req: $Subtype<$Request>, res: $Response) {
	const history = createHistory({initialEntries: [req.path]})
	const initialPath = history.location.pathname

	const store = createStore(history)

	const jss = createJss(jssPreset())

	const sheetsRegistry = new SheetsRegistry()

	const matchedRoute = flattenedRoutes.find(route => matchPath(req.url, ((route: any): Route)))
	const promises = []

	if (matchedRoute && matchedRoute.loadData) {
		promises.push(...matchedRoute.loadData.map(loadData => loadData(store.dispatch, req, res)))
	}

	return Promise.all(promises).then(() => {
		// Server's node instance can't reload files (HMR is for serving files to the client) so SSR is disabled during development to avoid getting out of sync.
		const html = renderToString(
			<AppContainer>
				<Provider store={store}>
					<JssProvider registry={sheetsRegistry} jss={jss}>
						<App history={history} url={req.url}/>
					</JssProvider>
				</Provider>
			</AppContainer>,
		)

		// If we encountered redirect, our history will be pointing to another location, seems as this is SSR, we should redirect now.
		if (history.location.pathname !== initialPath) {
			res.redirect(302, history.location.pathname)
		} else {
			// Grab the initial state from our Redux store
			const preloadedState = store.getState()

			// Send the rendered page back to the client
			res.send(renderHtml(html, sheetsRegistry.toString(), preloadedState))
		}
	}).catch(e => {
		console.error(e)
	})
}

app.use(cookieSession({name: 'session', secret: process.env.COOKIE_SESSION_SECRET}))
app.use(jsonParser())
app.use(urlEncodingParser({extended: true}))

app.use(passport())
app.use(session())

if (PROD) {
	app.use('/static', Express.static('./dist/static'))
	app.use('/', api)
	app.get('*', render)
} else {
	const HMR = require('./hmr.js')
	HMR(app)
	app.use('/', api)
	app.get('*', render)
}

const server = app.listen(port)

export default server
