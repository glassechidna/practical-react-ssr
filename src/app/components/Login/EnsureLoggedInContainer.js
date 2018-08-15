/* @flow */

import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Redirect } from 'react-router'

import routes from '../../../routes'


import type { Node } from 'react'

import type { AppState } from '../../../reducers'


type Props = {
	children?: Node,
}

type StateProps = {
	isLoggedIn: boolean,
}

type InnerProps = {
	...$Exact<Props>,
	...$Exact<StateProps>,
}

class EnsureLoggedInContainer extends Component<InnerProps> {
	render() {
		if (this.props.isLoggedIn) {
			return this.props.children
		} else {
			return <Redirect to={routes.LOGIN.path()}/>
		}
	}
}

function mapStateToProps(state: AppState, ownProps: Props): InnerProps {
	return {
		...ownProps,
		isLoggedIn: !!state.user.currentUser,
	}
}

export default connect(mapStateToProps)(EnsureLoggedInContainer)
