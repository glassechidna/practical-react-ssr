/* @flow */

import React, { Component } from 'react'

import {
	Route as SwitchRoute,
	Switch,
} from 'react-router-dom'


import routes, { routeProps } from '../../../routes'

import EnsureLoggedInContainer from '../Login/EnsureLoggedInContainer'


import type { Location } from 'react-router'

import type { Route } from '../../../routes'


type Props = {
	location: Location,
}

class Dashboard extends Component<Props> {
	render() {
		return (
			<EnsureLoggedInContainer>
				<Switch>
					{Object.values(routes.DASHBOARD.subroutes).map(route => {
						const {path, ...otherProps} = routeProps(((route: $FlowIssue): Route))
						return <SwitchRoute {...otherProps} path={path} key={path}/>
					})}
				</Switch>
			</EnsureLoggedInContainer>
		)
	}
}

export default Dashboard
