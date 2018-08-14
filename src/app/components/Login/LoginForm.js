/* @flow */

import React, {
	Component,
	Fragment,
} from 'react'

import { connect } from 'react-redux'

import { Redirect } from 'react-router'

import {
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	TextField,
	withStyles,
} from '@material-ui/core'

import { AsyncStatus } from '../../../api/types'

import { login } from '../../../actions/user'

import routes from '../../../routes'


import type { StatelessFunctionalComponent } from 'react'

import type { InjectedProps } from '@material-ui/core/styles/withStyles'


import type { AppState } from '../../../reducers'
import type { Dispatch } from '../../../store'


type Props = {
}

type StyledProps = {
	...$Exact<Props>,
	...$Exact<InjectedProps>,
}

type StateProps = {
	...$Exact<StyledProps>,
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
		const {classes, loggedIn, loggingIn} = this.props

		if (loggedIn) {
			return (<Redirect to={routes.DASHBOARD.path()}/>)
		}

		return (
			<Card classes={{root: classes.root}}>
				{loggingIn ? (
					<CircularProgress/>
				) : (
					<Fragment>
						<CardContent>
							<div>
								<TextField
									className={classes.field}
									label='E-mail'
									value={this.state.email}
									type='email'
									onChange={e => this.setState({...this.state, email: e.target.value})}
								/>
							</div>
							<div>
								<TextField
									className={classes.field}
									label='Password'
									value={this.state.password}
									type='password'
									onChange={e => this.setState({...this.state, password: e.target.value})}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											this._onLogin(e)
										}
									}}
								/>
							</div>
						</CardContent>
						<CardActions disableActionSpacing={true}>
							<Button fullWidth={true} variant='raised' color='primary' onClick={this._onLogin}>
								Login
							</Button>
						</CardActions>
					</Fragment>
				)}
			</Card>
		)
	}

	_onLogin = (event) => {
		event.preventDefault()

		const {email, password} = this.state
		this.props.dispatch(login(email, password))
	}
}

const styles = theme => ({
	root: {
		maxWidth: '640px',
		margin: '16px auto',
		textAlign: 'center',
	},
	field: {
		margin: theme.spacing.unit,
		minWidth: 240,
	}
})

function mapStateToProps(state: AppState, ownProps: StyledProps): StateProps {
	const loggingIn = state.user.loggingIn.status === AsyncStatus.IN_PROGRESS
	const loggedIn = !!state.user.currentUser

	return {
		...ownProps,
		loggingIn,
		loggedIn,
	}
}

export default (withStyles(styles)(connect(mapStateToProps)(LoginForm)) : StatelessFunctionalComponent<Props>)
