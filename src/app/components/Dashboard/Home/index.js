/* @flow */

import React, { Component } from 'react'

import {
	Check,
	Person,
} from '@material-ui/icons'


class Home extends Component<*> {
	render() {
		return (
			<div>
				<Person color="secondary"/>
				<span>
					You've logged in!
				</span>
				<Check color="primary"/>
			</div>
		)
	}
}

export default Home
