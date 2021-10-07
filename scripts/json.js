
//@ts-check

import Path from 'path'
import { ROOT_DIR, API_DIR, API_NAMES, OUT_JSON, readYamlFile, writeJsonFile } from './lib.js'


/**
    @param {string} outdir

    @typedef {import ('./lib').OADocument} OADocument
 */
export async function writeFlattenApis (outdir)
{
    console.log ()
    console.log ('## Json definition files')

    /** @type {OADocument} */
    const api = await readYamlFile (Path.join (API_DIR, 'api.yaml'))

    for (var ns of API_NAMES)
    {
        /** @type {OADocument} */
        var nsapi = await readYamlFile (Path.join (API_DIR, ns + '.yaml'))

        var duplicates = []
        
        if (nsapi.paths &&
            getDuplicates (api.paths, nsapi.paths, duplicates)
        ) {
            console.error (`Duplicate keys in ${ns}.yaml'#/paths`, duplicates)
            process.exit (1)
        }

        Object.assign (api.paths, nsapi.paths)
    }

    writeJsonFile (OUT_JSON, api)

    writeJsonFile (
        Path.join (outdir, 'neutralino.config.schema.json'),
        Object.assign (
            {
                '$schema': 'http://json-schema.org/draft-04/schema',
                id: 'https://neutralino.js.org/v2'
            },
            await readYamlFile (Path.join (ROOT_DIR, 'models', 'neutralino.config.schema.yaml'))
        )
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
 