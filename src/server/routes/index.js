/* @flow */

import routes from '../../routes'

import { setUser } from '../../actions/user'
import User from '../db/models/user'


import type { $Request, $Response } from 'express'

import type { Dispatch } from '../../store'

import type {
	BaseRoute,
	RouteMap,
} from '../../routes'


type LoadData = ((any => boolean, $Request, $Response) => Promise<*>)[]

export type ServerRoute = {|
	...$Exact<BaseRoute<ServerRoute>>,
	loadData?: LoadData
|}

async function setReduxUser(dispatch: Dispatch, req: $Subtype<$Request>, res: $Response) {
	if (req.user) {
		const user = ((req.user: any): ?User)

		if (user) {
			dispatch(setUser(user.publicRepresentation()))
		}
	}
}

const serverRoutes: RouteMap<ServerRoute> = {
	LOGIN: {
		...routes.LOGIN,
		loadData: [setReduxUser],
	},
	DASHBOARD: {
		...routes.DASHBOARD,
		loadData: [setReduxUser],
	},
}

export function flattenRoutes(routes: ?RouteMap<ServerRoute>, parentLoadData: LoadData = []): ServerRoute[] {
	const flatRoutes: ServerRoute[] = []

	if (routes) {
		Object.values(routes).forEach(r => {
			const route = ((r: any): ServerRoute)
			const loadData = route.loadData ? parentLoadData.concat(route.loadData) : parentLoadData

			// $FlowIssue: One day flow will get it together... one day...
			const newRoute: ServerRoute = {
				...route,
				loadData,
			}

			flatRoutes.push(newRoute)
			flatRoutes.push(...flattenRoutes(route.subroutes, loadData))
		})
	}

	return flatRoutes
}

export default serverRoutes
