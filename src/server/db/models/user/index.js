/* @flow */

import { default as bcrypt } from 'bcrypt'

import Sequelize from 'sequelize'

import sequelize from '../../'

const User = sequelize.define('User', {
	email: Sequelize.STRING,
	password: Sequelize.VIRTUAL,
	passwordHash: Sequelize.STRING,
})

User.beforeCreate(async function(user, options) {
	user.passwordHash = await bcrypt.hash(user.password, 10)
})

User.prototype.publicRepresentation = function() {
	const {id, email} = this
	return {
		id,
		email,
	}
}

export default User
