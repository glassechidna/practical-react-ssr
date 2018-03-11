/* @flow */

import * as api from '../api'

import { AsyncStates } from '../api/types'


import type { Dispatch } from '../store'

import type {
	DoneAsyncState,
	FailedAsyncState,
	InProgressAsyncState,
	User,
} from '../api/types'


export const LOGGING_IN = Object.freeze({type: 'LOGGING_IN'})

export type LoggingIn = {|
	type: $Values<typeof LOGGING_IN>,
	state: InProgressAsyncState,
|} | {|
	type: $Values<typeof LOGGING_IN>,
	state: DoneAsyncState,
	user: User,
|} | {|
	type: $Values<typeof LOGGING_IN>,
	state: FailedAsyncState,
|}

export const SET_USER = Object.freeze({type: 'SET_USER'})

export type SetUser = {|
	type: $Values<typeof SET_USER>,
	user: User,
|}

export function login(username: string, password: string) {
	return async function(dispatch: Dispatch): Promise<User> {
		const inProgress: InProgressAsyncState = AsyncStates.inProgress()

		try {
			dispatch({type: LOGGING_IN.type, state: inProgress})
			const user = await api.login(username, password)
			dispatch({type: LOGGING_IN.type, state: AsyncStates.done(inProgress), user})
			return user
		} catch (e) {
			const message = e.name === api.DISPLAYABLE_ERROR ? e.message : null
			const failed: FailedAsyncState = AsyncStates.failed(inProgress, message)
			dispatch({type: LOGGING_IN.type, state: failed})
			throw e
		}
	}
}

export function setUser(user: User): SetUser {
	return {type: SET_USER.type, user}
}

export type UserAction = LoggingIn |
	SetUser
