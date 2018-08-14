/* @flow */

import React, { Component } from 'react'

import {
	Route as SwitchRoute,
	Switch,
} from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import PropTypes from 'prop-types'

import 'typeface-roboto'

import {
	MuiThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles'


import './index.css'
import theme from './styling/theme'

import routes, {
	routeProps,
} from '../routes'


import type { Route } from '../routes'


export type Props = {
	history: any,
	sheetsManager?: Map<any, any>,
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
		const {history, sheetsManager} = this.props

		return (
			<MuiThemeProvider theme={createMuiTheme(theme)} sheetsManager={sheetsManager}>
				<ConnectedRouter history={history}>
					<Switch>
						{Object.values(routes).map(route => {
							const {path, ...otherProps} = routeProps(((route: $FlowIssue): Route))
							return <SwitchRoute {...otherProps} path={path} key={path}/>
						})}
					</Switch>
				</ConnectedRouter>
			</MuiThemeProvider>
		)
	}
}

export default App
