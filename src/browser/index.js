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

import JssProvider from 'react-jss/lib/JssProvider'

// Material UI

import {
	createGenerateClassName,
	jssPreset,
} from '@material-ui/core/styles'


const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__

const history = createHistory()
const store = createStore(history, preloadedState)

const jss = createJss(jssPreset())
jss.options.createGenerateClassName = createGenerateClassName

function render(AppComponent: any) {

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
