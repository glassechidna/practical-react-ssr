/* @flow */

import React from 'react'

import Home from '../app/components/Dashboard/Home'

import Login from '../app/components/Login'
import Dashboard from '../app/components/Dashboard'

type OptionalPathRoute = {|
	path?: string,
	exact?: boolean,
	strict?: boolean,
	sensitive?: boolean,
	component: React$ComponentType<any>,
	icon?: ?React$ComponentType<any>,
	title: string,
	longTitle?: ?string,
	subroutes?: { [string]: $Exact<OptionalPathRoute> },
|}

export type BaseRoute<T : BaseRoute<*>> = {
	path: string,
	exact?: boolean,
	strict?: boolean,
	sensitive?: boolean,
	component: React$ComponentType<any>,
	icon?: ?React$ComponentType<any>,
	title: string,
	longTitle?: ?string,
	subroutes?: RouteMap<T>,
}

export type Route = {|
	...$Exact<BaseRoute<Route>>,
|}

export type RouteMap<T : BaseRoute<*>> = { [string]: $Exact<T> }

export function flattenRoutes(routes: ?RouteMap<Route>): Route[] {
	const flatRoutes: Route[] = []

	if (routes) {
		Object.values(routes).forEach(r => {
			const route = ((r: $FlowIssue): Route)
			flatRoutes.push(route)
			flatRoutes.push(...flattenRoutes(route.subroutes))
		})
	}

	return flatRoutes
}

function propagatePaths(tempRoutes: { [string]: $Exact<OptionalPathRoute> }, pathPrefix: string = ''): RouteMap<Route> {
	const routes: RouteMap<Route> = {}

	Object.keys(tempRoutes).forEach(key => {
		const tempRoute = tempRoutes[key]
		const {path, exact, strict, sensitive, component, icon, title, longTitle, subroutes} = tempRoute
		const effectivePath = path || ''

		const propagatedPath = pathPrefix.endsWith('/') || effectivePath.startsWith('/') ? pathPrefix + effectivePath : pathPrefix + '/' + effectivePath
		const propagatedSubroutes = subroutes ? propagatePaths(subroutes, propagatedPath) : undefined

		routes[key] = {
			exact,
			strict,
			sensitive,
			component,
			icon,
			title,
			longTitle,
			path: propagatedPath,
			subroutes: propagatedSubroutes,
		}
	})

	return routes
}

export default propagatePaths({
	LOGIN: {
		path: '/login',
		component: Login,
		title: 'Login',
	},
	DASHBOARD: {
		path: '/',
		component: Dashboard,
		title: 'Dashboard',
		subroutes: {
			HOME: {
				component: Home,
				title: 'Dashboard',
			},
		},
	},
})
