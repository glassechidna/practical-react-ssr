/* @flow */

import { compare as bcryptCompare } from 'bcrypt'

import User from '../db/models/user'

export default async function(email: String, password: String): Promise<?User> {
	const user = await User.findOne({where: {email: email}})

	if (user) {
		if (await bcryptCompare(password, user.passwordHash)) {
			return user
		}
	}

	return null
}
