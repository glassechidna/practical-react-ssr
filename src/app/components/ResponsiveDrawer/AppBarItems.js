/* @flow */

import React, { Component } from 'react'

import {
	withStyles,
} from '@material-ui/core'


import type { StatelessFunctionalComponent } from 'react'

import type { Location } from 'react-router'

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

class AppBarItems extends Component<InnerProps> {
	render() {
		return null
	}
}

const styles = theme => ({})

export default ((withStyles(styles)(AppBarItems): any): StatelessFunctionalComponent<*>)
