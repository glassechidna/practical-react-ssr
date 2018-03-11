/* @flow */

import React, { Component } from 'react'

import {
	Route,
	Switch,
} from 'react-router-dom'

import routes from '../../../routes'

import EnsureLoggedInContainer from '../Login/EnsureLoggedInContainer'


import type { Location } from 'react-router'

import type { Route as RouteType } from '../../../routes'


type Props = {
	location: Location,
}

class Dashboard extends Component<Props> {
	render() {
		return (
			<EnsureLoggedInContainer>
				<Switch>
					{Object.values(routes.DASHBOARD.subroutes).map(route => (
						<Route {...route} key={((route: any): RouteType).path}/>
					))}
				</Switch>
			</EnsureLoggedInContainer>
		)
	}
}

export default Dashboard
