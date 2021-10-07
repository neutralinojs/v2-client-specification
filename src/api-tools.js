
//@ts-check

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'
import Yaml from 'yaml'
import Json from '@apidevtools/json-schema-ref-parser'

//@ts-ignore
export const __dirname = Path.dirname (Url.fileURLToPath (import.meta.url))

/**
    @typedef {import ('openapi-types').OpenAPIV3.Document} OADocument
*/

if (process.cwd () != __dirname)
{
    exit (
        'You need to run this script in the `/api` directory.\n' +
        'This is necessary to resolve JSON references.'
    )
}


export const namespaces = ['app', 'computer', 'debug', 'filesystem', 'os', 'storage', 'window']


export function exit (...texts)
{
    console.error (...texts)
    process.exit (1)
}

/**
    @param {string} filepath 
    @param {boolean} [flatten]
        If set to `true`, `$ref` fields are replaced by the content of its reference.
        This is necessary because some tools do not support external references.
    @returns {Promise <object>}
 */
export function readYamlFile (filepath, flatten = true)
{
    return flatten
         ? new Promise ((resolve, reject) => Json.dereference (
            Yaml.parse (Fs.readFileSync (filepath, 'utf8')),
            (err, sch) => { if (err) reject (err) ; resolve (sch) }
        ))
        : Promise.resolve (Yaml.parse (Fs.readFileSync (filepath, 'utf8')))
}


/**
 * @param {object} obj 
 * @param {string} filepath 
 */
export function writeJsonFile (obj, filepath)
{
    console.log ('Write', filepath)
    Fs.writeFileSync (filepath, JSON.stringify (obj, null, 2), { encoding: 'utf8' })
}

/**
 * @param {string} filepath 
 * @param {string} content
 */
export function writeFile (filepath, content)
{
    console.log ('Write', filepath)
    Fs.writeFileSync (filepath, content, { encoding: 'utf8' })
}
