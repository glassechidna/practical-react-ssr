/* @flow */

import getUuid from 'uuid/v4'

export type UnixDate = number

export const AsyncStatus = Object.freeze({
	INITIAL: 'INITIAL',
	DONE: 'DONE',
	IN_PROGRESS: 'IN_PROGRESS',
	FAILED: 'FAILED',
})

export type InitialAsyncState = {|
	status: 'INITIAL',
|}

export type DoneAsyncState = {|
	status: 'DONE',
	uuid: string,
	startTime: UnixDate,
|}

export type InProgressAsyncState = {|
	status: 'IN_PROGRESS',
	uuid: string,
	startTime: UnixDate,
|}

export type FailedAsyncState = {|
	status: 'FAILED',
	uuid: string,
	startTime: UnixDate,
	errorMessage?: string,
|}

export type AsyncState = InitialAsyncState | DoneAsyncState | InProgressAsyncState | FailedAsyncState
export type ActiveAsyncState = DoneAsyncState | InProgressAsyncState | FailedAsyncState

export class AsyncStates {
	static initial(): InitialAsyncState {
		return {status: AsyncStatus.INITIAL}
	}

	static inProgress(uuid: string = getUuid(), startTime: UnixDate = Date.now()): InProgressAsyncState {
		return {status: AsyncStatus.IN_PROGRESS, uuid, startTime}
	}

	static done(inProgressState: InProgressAsyncState): DoneAsyncState {
		const {uuid, startTime} = inProgressState
		return {status: AsyncStatus.DONE, uuid, startTime}
	}

	static failed(inProgressState: InProgressAsyncState, errorMessage?: ?string): FailedAsyncState {
		const {uuid, startTime} = inProgressState
		return errorMessage ? {status: AsyncStatus.FAILED, uuid, startTime, errorMessage} : {
			status: AsyncStatus.FAILED,
			uuid,
			startTime,
		}
	}

	static update(oldState: AsyncState, newState: ActiveAsyncState): AsyncState {
		return (newState.status === AsyncStatus.IN_PROGRESS || oldState.uuid === newState.uuid) ? newState : oldState
	}
}

export function isAsyncStateComplete(state : AsyncState) {
	return state.status === AsyncStatus.DONE || state.status === AsyncStatus.FAILED
}

export type User = {
	id: number,
	email: string,
}
