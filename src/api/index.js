/* @flow */

import { Urls } from "./routes"


import type { User } from './types'


const HEADERS_SEND_RECEIVE_JSON = Object.freeze({
	'Accept': 'application/json',
	'Content-Type': 'application/json',
})

export const DISPLAYABLE_ERROR = 'au.com.glassechidna.DisplayableError'

export class DisplayableError extends Error {
	constructor(message: string) {
		super(message)

		this.name = DISPLAYABLE_ERROR
	}
}

export const RESPONSE_ERROR = 'au.com.glassechidna.ResponseError'

class ResponseError extends Error {
	response: any

	constructor(response: Response, message?: ?string) {
		super(message ? message : response.status + ": " + response.url)

		this.name = RESPONSE_ERROR
		this.response = response
	}
}

async function validateResponseOk(response, jsonErrorHandler: ?(Object) => ?boolean) {
	if (!response.ok) {
		let contentType = response.headers.get('Content-Type')

		if (contentType && contentType.startsWith('application/json')) {
			const data = await response.clone().json()

			if (!jsonErrorHandler || !jsonErrorHandler(data)) {
				if (data.reason) {
					throw new DisplayableError(data.reason)
				} else {
					throw new ResponseError(response)
				}
			}
		} else {
			throw new ResponseError(response)
		}
	}

	return true
}

export async function login(username: string, password: string): Promise<User> {
	const response = await fetch(Urls.login(), {
		method: 'POST',
		headers: HEADERS_SEND_RECEIVE_JSON,
		body: JSON.stringify({username, password}),
		credentials: 'same-origin',
	})

	await validateResponseOk(response)

	const data = await response.json()

	return {
		id: data.id,
		email: data.email,
	}
}
