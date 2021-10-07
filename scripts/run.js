
//@ts-check


import Path from 'path'
import chokidar from 'chokidar'
import { writeFlattenApis } from './json.js'
import { writeDts } from './dts.js'
import { OUT_DIR, API_DIR, getCmdArgument } from './lib.js'


if (process.argv.includes ('--watch-json'))
{
    const watcher = chokidar.watch (Path.join (API_DIR, '*.yaml'), { ignored: './api.yaml', persistent: true })
    watcher.on ('change', () =>
    {
        writeFlattenApis (OUT_DIR)
    })
}
else if (process.argv.includes ('--build-json'))
{
    const outdir = getCmdArgument ('--out')
    console.log (outdir)
    writeFlattenApis (outdir)
}


if (process.argv.includes ('--build-dts'))
{
    writeDts (OUT_DIR)
}
