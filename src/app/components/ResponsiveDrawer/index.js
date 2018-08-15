/* @flow */

import React, {
	Component,
	Fragment,
} from 'react'
import { connect } from 'react-redux'

import { matchPath } from 'react-router'

import {
	AppBar,
	Drawer,
	Toolbar,
	Typography,
	IconButton,
	Hidden,
	withStyles,
} from '@material-ui/core'

import { Menu as MenuIcon } from '@material-ui/icons'

import classNames from 'classnames'


import AppBarItems from './AppBarItems'

import Sidebar from './Sidebar'

import { routeProps } from '../../../routes'


import type {
	ChildrenArray,
	StatelessFunctionalComponent,
} from 'react'

import type { Location } from 'react-router'

import type {
	InjectedProps,
	InjectedWithThemeProps,
} from '@material-ui/core/styles/withStyles'


import type { Route } from '../../../routes'

import type { AppState } from '../../../reducers'


export type Props = {
	location: Location,
	routes: Route[],
	children: ChildrenArray<*>,
	alwaysOpenInLargeWindows?: boolean,
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


type State = {
	mobileOpen: boolean,
}

const DRAWER_WIDTH = 240

class ResponsiveDrawer extends Component<InnerProps, State> {
	state = {
		mobileOpen: false,
	}

	handleDrawerToggle = () => {
		this.setState({mobileOpen: !this.state.mobileOpen})
	}

	render() {
		const {alwaysOpenInLargeWindows, classes, location, theme} = this.props

		const menuButton = (
			<IconButton
				color='inherit'
				aria-label='open drawer'
				onClick={this.handleDrawerToggle}
			>
				<MenuIcon/>
			</IconButton>
		)
		const sidebar = <Sidebar location={location} routes={this.props.routes}/>

		const temporaryDrawer = (
			<Drawer
				variant='temporary'
				anchor={theme.direction === 'rtl' ? 'right' : 'left'}
				open={this.state.mobileOpen}
				classes={{
					docked: classes.drawerDocked,
					paper: classes.drawerPaper,
				}}
				onClose={this.handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
			>
				{sidebar}
			</Drawer>
		)

		return (
			<div className={classes.root}>
				<div className={classes.appFrame}>
					<AppBar className={classNames(classes.appBar, alwaysOpenInLargeWindows && classes.appBarAlwayOpenInLargeWindows)}>
						<Toolbar>
							{alwaysOpenInLargeWindows ? (
								<Hidden mdUp implementation='css'>
									{menuButton}
								</Hidden>
							) : menuButton}
							<Typography variant='title' color='inherit' noWrap className={classes.title}>
								{this._title()}
							</Typography>
							{alwaysOpenInLargeWindows ? (
								<Hidden smDown implementation='css'>
									<AppBarItems/>
								</Hidden>
							) : <AppBarItems/>}
						</Toolbar>
					</AppBar>
					{alwaysOpenInLargeWindows ? (
						<Fragment>
							<Hidden mdUp implementation='css'>
								{temporaryDrawer}
							</Hidden>
							<Hidden smDown implementation='css'>
								<Drawer
									variant='permanent'
									open
									classes={{
										docked: classes.drawerDocked,
										paper: classes.drawerPaper,
									}}
								>
									{sidebar}
								</Drawer>
							</Hidden>
						</Fragment>
					) : temporaryDrawer}
					<main className={classes.content}>
						{this.props.children}
					</main>
				</div>
			</div>
		)
	}

	_title() {
		const {appState, location} = this.props

		for (const route of this.props.routes) {
			if (matchPath(this.props.location.pathname, routeProps(route))) {
				return route.longTitle ? route.longTitle(location, appState) : route.title(location, appState)
			}
		}

		return ''
	}
}

const styles = theme => ({
	root: {
		width: '100%',
		height: '100%',
		zIndex: 1,
		overflow: 'hidden',
	},
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		height: '100%',
	},
	appBar: {
		position: 'absolute',
		marginLeft: DRAWER_WIDTH,
		backgroundColor: theme.palette.background.default,
		boxShadow: 'none',
		borderBottom: '0',
		marginBottom: '0',
		color: theme.palette.grey[700],
	},
	appBarAlwayOpenInLargeWindows: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${DRAWER_WIDTH}px)`,
		},
	},
	drawerDocked: {
		height: '100%',
	},
	drawerPaper: {
		width: 250,
		[theme.breakpoints.up('md')]: {
			width: DRAWER_WIDTH,
			position: 'relative',
			height: '100%',
		},
	},
	title: {
		flex: 1,
		fontWeight: 300,
	},
	content: {
		backgroundColor: theme.palette.background.default,
		width: '100%',
		padding: theme.spacing.unit * 3,
		marginTop: 56,
		[theme.breakpoints.up('sm')]: {
			marginTop: 64,
		},
		overflowY: 'auto',
	},
})


function mapStateToProps(state: AppState, ownProps: StyledProps): StateProps {
	return {
		...ownProps,
		appState: state,
	}
}

export default (withStyles(styles, {withTheme: true})(connect(mapStateToProps)(ResponsiveDrawer)): StatelessFunctionalComponent<Props>)
