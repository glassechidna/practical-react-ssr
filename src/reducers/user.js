/* @flow */

import {
	AsyncStates,
} from '../api/types'

import * as UserActions from '../actions/user'

import type {
	AsyncState,
	User,
} from '../api/types'

import type { Action } from '../actions'

export type UserState = {
	loggingIn: AsyncState,
	currentUser: ?User,
}

const initialState: UserState = {
	loggingIn: AsyncStates.initial(),
	currentUser: null,
}

const user = (state: UserState = initialState, action: Action): UserState => {
	switch (action.type) {
		case UserActions.LOGGING_IN.type: {
			const loggingIn = AsyncStates.update(state.loggingIn, action.state)

			if (loggingIn !== state.loggingIn) {
				const currentUser = action.user ? action.user : state.currentUser

				return {
					...state,
					currentUser,
					loggingIn,
				}
			}

			break
		}

		case UserActions.SET_USER.type: {
			return {
				...state,
				currentUser: action.user,
			}
		}
	}

	return state
}

export default user
