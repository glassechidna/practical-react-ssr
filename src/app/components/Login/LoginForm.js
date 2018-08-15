/* @flow */

import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Redirect } from 'react-router'

import { AsyncStatus } from '../../../api/types'

import { login } from '../../../actions/user'

import routes from '../../../routes'


import type { AppState } from '../../../reducers'
import type { Dispatch } from '../../../store'


type Props = {
}

type StateProps = {
	...$Exact<Props>,
	loggingIn: boolean,
	loggedIn: boolean,
}

type InnerProps = {
	...$Exact<StateProps>,
	dispatch: Dispatch,
}


type State = {|
	email: string,
	password: string,
|}

class LoginForm extends Component<InnerProps, State> {
	constructor(props: InnerProps) {
		super(props)
		this.state = {email: '', password: ''}
	}

	render() {
		if (this.props.loggedIn) {
			return (<Redirect to={routes.DASHBOARD.path()}/>)
		}

		return (
			<div>
				{!this.props.loggingIn && (
					<div>
						<div>
							<label>
								E-mail:
								<input value={this.state.email} type='email' onChange={e => {
									this.setState({...this.state, email: e.target.value})
								}}/>
							</label>
						</div>
						<div>
							<label>
								Password:
								<input value={this.state.password} type='password' onChange={e => {
									this.setState({...this.state, password: e.target.value})
								}}/>
							</label>
						</div>
						<input type='submit' onClick={this._onLogin}/>
					</div>
				)}
			</div>
		)
	}

	_onLogin = (event) => {
		event.preventDefault()

		const {email, password} = this.state
		this.props.dispatch(login(email, password))
	}
}

function mapStateToProps(state: AppState, ownProps: Props): StateProps {
	const loggingIn = state.user.loggingIn.status === AsyncStatus.IN_PROGRESS
	const loggedIn = !!state.user.currentUser

	return {
		...ownProps,
		loggingIn,
		loggedIn,
	}
}

export default connect(mapStateToProps)(LoginForm)
