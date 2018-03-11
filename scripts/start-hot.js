require('@babel/register')

const webpack = require('webpack')

const serverConfig = require('../webpack.config.babel').serverConfig

const environment = process.env.NODE_ENV === 'development' ? {development: true} : {production: true}
const config = serverConfig({...environment})
const bundlePath = `${config.output.path}/${config.output.filename}`

const compiler = webpack(config)
const compilerOptions = {
	aggregateTimeout: 300,
	poll: true,
}

let server = null

const openSockets = new Map()
let nextSocketId = 0

function loadServer() {
	delete require.cache[require.resolve(bundlePath)]
	server = require(bundlePath).default

	server.on('connection', (socket) => {
		const socketId = nextSocketId++
		openSockets.set(socketId, socket)

		socket.on('close', () => {
			openSockets.delete(socketId)
		})
	})

}

compiler.watch(compilerOptions, (err, stats) => {
	if (err) {
		console.log(`Server bundling error: ${JSON.stringify(err)}`)
		return
	}

	if (server) {
		for (const socket of openSockets.values()) {
			socket.destroy()
		}

		server.close(() => {
			loadServer()
			console.log('Server restarted')
		})
	} else {
		loadServer()
		console.log("Server started.")
	}
})
