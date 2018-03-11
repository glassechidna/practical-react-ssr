/* @flow */

import {
	combineReducers,
} from 'redux'

import { routerReducer as router } from 'react-router-redux'

import user from './user'


import type { Reducer } from 'redux'

import type { Action } from '../actions'
import type { UserState } from './user'

export type AppState = {
	router: Object,
	user: UserState,
}

const appReducer: Reducer<AppState, Action> = combineReducers({
	router,
	user,
})

export default appReducer
