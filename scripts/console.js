const repl = require('repl')

require('@babel/register')

global.__BROWSER__ = false
global.__SERVER__ = true

require('../src/server/env')
require('../src/server/db/index')

const replServer = repl.start({})

for (const [name, model] of Object.entries(require('../src/server/db/models/index'))) {
	replServer.context[name] = model
}
