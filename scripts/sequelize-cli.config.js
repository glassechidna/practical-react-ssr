require('@babel/register')

const path = require('path')

try {
	const dotenv = require('dotenv')
	dotenv.load({path: path.resolve(__dirname, '../', '.env')})
	dotenv.load({path: path.resolve(__dirname, '../', '.env.' + env)})
} catch (e) {
	/* Do nothing */
}

const urlMatch = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

const postgres = {
	database: urlMatch[5],
	username: urlMatch[1],
	password: urlMatch[2],
	port: urlMatch[4],
	host: urlMatch[3],
	dialect: 'postgres',
	protocol: 'postgres',
}

module.exports = {
	development: {
		...postgres,
	},
	production: {
		...postgres,
		dialectOptions: {
			ssl: true,
		},
	},
}
