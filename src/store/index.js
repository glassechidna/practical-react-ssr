/* @flow */

import {
	applyMiddleware,
	createStore as reduxCreateStore,
} from 'redux'

import {
	routerMiddleware,
} from 'react-router-redux'

import thunk from 'redux-thunk'

import appReducer from '../reducers'


import type { Store } from 'redux'

import type { Action } from '../actions'
import type { AppState } from '../reducers'


type PromiseAction = Promise<Action>
type ThunkAction = (dispatch: Dispatch, getState: () => AppState) => any

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any


export default (history: any, preloadedState?: AppState) => {
	const middleware = [thunk, routerMiddleware(history)]

	if (process.env.NODE_ENV === 'development') {
		middleware.push(require('redux-logger').createLogger())
	}

	const store: Store<AppState, Action, Dispatch> = reduxCreateStore(appReducer, preloadedState, applyMiddleware(...middleware))

	if (module.hot) {
		// $FlowFixMe - module.hot is global so flow has a lil freak-out
		module.hot.accept('../reducers', () => {
			const nextAppReducer = require('../reducers').default
			store.replaceReducer(nextAppReducer)
		})
	}


	return store
}
