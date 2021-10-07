
//@ts-check

import Path from 'path'
import chokidar from 'chokidar'
import { namespaces, readYamlFile, writeJsonFile, exit, __dirname } from './api-tools.js'


if (process.argv.includes ('--watch-json'))
{
    const watcher = chokidar.watch ('./*.yaml', { ignored: './api.yaml', persistent: true })
    watcher.on ('change', (path, stats) =>
    {
        writeFlattenApis ()
    })
}
else if (process.argv.includes ('--build-json'))
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
 