/* @flow */

import Sequelize from 'sequelize'

const url = process.env.DATABASE_URL || ''

const sequelize = new Sequelize(url, {
	dialect: 'postgres',
	protocol: 'postgres',
	operatorsAliases: false,
	dialectOptions: {
		ssl: process.env.NODE_ENV === 'production',
	},
})

export default sequelize
