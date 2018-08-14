/* @flow */

import {
	purple,
	green,
} from '@material-ui/core/colors'

const Palette = Object.freeze({
	primary: purple,
	secondary: green,
	// Add custom colors here
})

export type PaletteColorName = $Keys<typeof Palette>

export default {
	palette: Palette,
	status: {
		danger: 'orange',
	},
}
