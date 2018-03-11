/* @flow */

export const Paths = Object.freeze({
	login: () => '/login',
})

// $FlowIssue: Spread is fine here, ignore flow.
export const Urls = Object.freeze(Object.assign(...Object.entries(Paths).map(([name, path]) => ({
	// $FlowIssue: Object.entries() presently drops type information
	[name]: () => global.__SERVER_HOST__ + path.apply(null, arguments),
}))))
