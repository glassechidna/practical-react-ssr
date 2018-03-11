/* @flow */

import React, { Component } from 'react'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import PropTypes from 'prop-types'

import routes from '../routes'

export type Props = {
	history: any,
}

class App extends Component<Props> {
	static childContextTypes = {
		router: PropTypes.object.isRequired,
	}

	getChildContext() {
		// staticContext is detected by react-router's `Redirect` component. It's existence causes the redirection to be performed in
		// componentWillMount() on the server, as componentDidMount() is never called on the server.
		return {
			...this.context,
			router: {
				...(global.__SERVER__ ? {staticContext: {}} : {}),
			},
		}
	}

	componentDidMount() {
		const jssStyles = document.getElementById('preloaded-jss')

		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles)
		}
	}

	render() {
		const history = this.props.history

		return (
			<ConnectedRouter history={history}>
				<Switch>
					{Object.values(routes).map(route => (
						<Route {...route} key={(route: $FlowIssue).path}/>
					))}
				</Switch>
			</ConnectedRouter>
		)
	}
}

export default App
