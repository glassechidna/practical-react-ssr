import User from '../models/user'

export default {
	up: (queryInterface, Sequelize) => {
		return User.create({email: 'admin@localhost', password: 'practicalSSR'})
	},

	down: (queryInterface, Sequelize) => {
		return User.destroy({where: {email: 'admin@localhost'}})
	},
}
