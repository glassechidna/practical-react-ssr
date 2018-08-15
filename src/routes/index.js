/* @flow */

import React from 'react'

import Home from '../app/components/Dashboard/Home'

import Login from '../app/components/Login'
import Dashboard from '../app/components/Dashboard'


import type { Location } from 'react-router'


import type { AppState } from '../reducers'


type OptionalPathRoute = {|
	path?: (options? : Object) => string,
	exact?: boolean,
	strict?: boolean,
	sensitive?: boolean,
	component: React$ComponentType<any>,
	icon?: ?React$ComponentType<any>,
	title: (location : Location, state : ?AppState) => string,
	longTitle?: (location : Location, state : ?AppState) => string,
	subroutes?: { [string]: $Exact<OptionalPathRoute> },
|}

export type BaseRoute<T : BaseRoute<*>> = {
	path: (options? : Object) => string,
	exact?: boolean,
	strict?: boolean,
	sensitive?: boolean,
	component: React$ComponentType<any>,
	icon?: ?React$ComponentType<any>,
	title: (location : Location, state : ?AppState) => string,
	longTitle?: (location : Location, state : ?AppState) => string,
	subroutes?: RouteMap<T>,
}

export type Route = {|
	...$Exact<BaseRoute<Route>>,
|}

export type RouteMap<T : BaseRoute<*>> = { [string]: $Exact<T> }

export type RouteOptions = {
	component: React$ComponentType<*>,
	path?: string,
	exact?: boolean,
	strict?: boolean,
	sensitive?: boolean
}

export function routeProps(route : BaseRoute<*>, options? : Object = {}) : RouteOptions {
	const {component, exact, path, sensitive, strict} = route

	const pathOptions : RouteOptions = {
		component
	}

	if (exact) {
		pathOptions.exact = exact
	}

	if (path) {
		pathOptions.path = path()
	}

	if (sensitive) {
		pathOptions.sensitive = sensitive
	}

	if (strict) {
		pathOptions.strict = strict
	}

	return pathOptions
}

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

function propagatePaths(tempRoutes: { [string]: $Exact<OptionalPathRoute> }, pathPrefix : (options? : Object) => string = () => ''): RouteMap<Route> {
	const routes: RouteMap<Route> = {}

	Object.keys(tempRoutes).forEach(key => {
		const tempRoute = tempRoutes[key]
		const {path, exact, strict, sensitive, component, icon, title, longTitle, subroutes} = tempRoute
		const effectivePath = path ? path() : ''
		const effectivePathPrefix = pathPrefix()

		const propagatedPath = path ? (
			effectivePathPrefix.endsWith('/') || effectivePath.startsWith('/') ? (
				(options? : Object) => pathPrefix(options) + path(options)
			) : (
				(options? : Object) => pathPrefix(options) + '/' + path(options)
			)
		) : (
			effectivePathPrefix.endsWith('/') || effectivePath.startsWith('/') ? (
				(options? : Object) => pathPrefix(options)
			) : (
				(options? : Object) => pathPrefix(options) + '/'
			)
		)

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
		path: () => '/login',
		component: Login,
		title: () => 'Login',
	},
	DASHBOARD: {
		path: () => '/',
		component: Dashboard,
		title: () => 'Dashboard',
		subroutes: {
			HOME: {
				component: Home,
				title: () => 'Dashboard',
			},
		},
	},
})
