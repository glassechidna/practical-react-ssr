/* @flow */

import React from 'react'

import { hydrate } from 'react-dom'

import { AppContainer } from 'react-hot-loader'

import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'

import App from '../app'

import createStore from '../store'

// JSS

import { create as createJss } from 'jss'
import jssPreset from 'jss-preset-default'

import JssProvider from 'react-jss/lib/JssProvider'


const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__

const history = createHistory()
const store = createStore(history, preloadedState)

function render(AppComponent: any) {
	const jss = createJss(jssPreset())

	return (
		<AppContainer>
			<Provider store={store}>
				<JssProvider jss={jss}>
					<AppComponent history={history}/>
				</JssProvider>
			</Provider>
		</AppContainer>
	)
}

let rootElement = document.getElementById('root')

if (rootElement) {
	hydrate(render(App), rootElement)
} else {
	throw new Error('App root element not found')
}

if (module.hot) {
	// $FlowFixMe - module.hot is global so flow has a lil freak-out
	module.hot.accept('../app', () => {
		const nextApp = require('../app').default
		rootElement = document.getElementById('root')

		if (rootElement) {
			hydrate(render(App), rootElement)
		} else {
			throw new Error('App root element not found')
		}
	})
}
