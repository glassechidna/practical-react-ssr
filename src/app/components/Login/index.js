/* @flow */

import React, { Component } from 'react'

import LoginForm from './LoginForm'

class Login extends Component<*> {
	render() {
		return (
			<div style={styles.app}>
				<LoginForm/>
			</div>
		)
	}
}

const styles = {
	app: {},
}

export default Login
