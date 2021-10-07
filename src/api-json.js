
//@ts-check

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'
import Yaml from 'yaml'
import Json from '@apidevtools/json-schema-ref-parser'
import chokidar from 'chokidar'
import { namespaces, readYamlFile, writeJsonFile, exit } from './api-tools.js'

//@ts-ignore
const __dirname = Path.dirname (Url.fileURLToPath (import.meta.url))

if (process.cwd () != __dirname)
{
    exit (
        'You need to run this script in the `/api` directory.\n' +
        'This is necessary to resolve JSON references.'
    )
}


if (process.argv.includes ('--watch'))
{
    const watcher = chokidar.watch ('./*.yaml', { ignored: './api.yaml', persistent: true })
    watcher.on ('change', (path, stats) =>
    {
        writeFlattenApis ()
    })
}
else
{
    writeFlattenApis ()
}

/**
    @typedef {import ('./api-tools').OADocument} OADocument
 */
export async function writeFlattenApis ()
{
    /** @type {OADocument} */
    const api = await readYamlFile (Path.join (__dirname, 'api.yaml'))

    for (var ns of namespaces)
    {
        /** @type {OADocument} */
        var nsapi = await readYamlFile (Path.join (__dirname, ns + '.yaml'))

        var duplicates = []
        
        if (nsapi.paths &&
            getDuplicates (api.paths, nsapi.paths, duplicates)
        ) exit (`Duplicate keys in ${ns}.yaml'#/paths`, duplicates)

        Object.assign (api.paths, nsapi.paths)
    }

    writeJsonFile (api, Path.join (__dirname, 'api.json'))

    writeJsonFile (
        Object.assign (
            {
                '$schema': 'http://json-schema.org/draft-04/schema',
                id: 'https://neutralino.js.org/v2'
            },
            await readYamlFile (Path.join (__dirname, '..', 'models', 'neutralino.config.schema.yaml'))
        ),
        Path.join (__dirname, '..', 'neutralino.config.schema.json')
    )

    /**
    @param {object} objA 
    @param {object} objB 
    @param {string[]} out 
     */
    function getDuplicates (objA, objB, out)
    {
        const keysA = Object.getOwnPropertyNames (objA)
        const keysB = Object.getOwnPropertyNames (objB)
        for (var k of keysA) {
            if (keysB.includes (k)) out.push (k)
        }
        return out.length > 0
    }
}
 