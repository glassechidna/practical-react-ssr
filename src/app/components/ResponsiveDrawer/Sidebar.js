/* @flow */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Location } from 'react-router'

import { NavLink } from 'react-router-dom'

import {
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	withStyles,
} from '@material-ui/core'


import type { StatelessFunctionalComponent } from 'react'

import type {
	InjectedProps,
	InjectedWithThemeProps,
} from '@material-ui/core/styles/withStyles'


import type { AppState } from '../../../reducers'

import type { Route } from '../../../routes'


type Props = {
	location: Location,
	routes: Route[],
}

type StyledProps = {
	...$Exact<Props>,
	...$Exact<InjectedProps>,
	...$Exact<InjectedWithThemeProps>,
}

type StateProps = {
	...$Exact<StyledProps>,
	appState: ?AppState,
}

type InnerProps = {
	...$Exact<StateProps>,
}

class Sidebar extends Component<InnerProps> {
	render() {
		const {appState, classes, location, routes} = this.props
		return (
			<div>
				<div className={classes.drawerHeader}/>
				<Divider/>
				<List>
					{routes.filter(route => ((route: any): Route).icon).reverse().map(r => {
						const route = ((r: any): Route)
						const icon = route.icon ? React.createElement(route.icon) : ''
						return (
							<NavLink className={classes.navLink} to={route.path()} key={route.path()}>
								<ListItem button color='primary'>
									<ListItemIcon>
										{icon}
									</ListItemIcon>
									<ListItemText primary={route.title(location, appState)}/>
								</ListItem>
							</NavLink>
						)
					})}
				</List>
			</div>
		)
	}
}

const styles = theme => ({
	drawerHeader: theme.mixins.toolbar,
	navLink: {
		textDecoration: 'none',
		color: 'inherit',
	},
})

function mapStateToProps(state: AppState, ownProps: StyledProps): StateProps {
	return {
		...ownProps,
		appState: state,
	}
}

export default (withStyles(styles, {withTheme: true})(connect(mapStateToProps)(Sidebar)): StatelessFunctionalComponent<Props>)
