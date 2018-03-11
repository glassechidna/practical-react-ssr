/* @flow */

import passportModule from 'passport'
import LocalStrategy from 'passport-local'

import User from '../db/models/user'

import authenticateUser from '.'

passportModule.use(new LocalStrategy(
	function(email, password, done) {
		authenticateUser(email, password).then(user => {
			if (user) {
				done(null, user)
			} else {
				done(null, false, {message: 'Invalid username or password.'})
			}
		}).catch(e => {
			done(e)
		})
	},
))

passportModule.serializeUser((user: User, done) => {
	done(null, user.id)
})

passportModule.deserializeUser((id: number, done) => {
	User.findById(id).then(user => done(null, user)).catch(e => done(e, null))
})

export const passport = passportModule.initialize.bind(passportModule)
export const session = passportModule.session.bind(passportModule)

export function authenticate(options: Object = {}) {
	return passportModule.authenticate('local', options)
}
