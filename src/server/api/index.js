/* @flow */

import { Router } from 'express'

import { Paths } from '../../api/routes'

import { authenticate } from '../authentication/passport'


import type {
	$Request,
	$Response,
} from 'express'


const router = Router()

router.post(Paths.login(), authenticate(), async (req: $Subtype<$Request>, res: $Response) => {
	const {id, email} = req.user
	res.json({id, email})
})

export default router
