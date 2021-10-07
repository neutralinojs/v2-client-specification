
/*/
    Utilities for working with API definition files.
/*/

import Fs   from 'fs'
import Path from 'path'
import Url  from 'url'
import Yaml from 'yaml'
import Json from '@apidevtools/json-schema-ref-parser'

//@ts-ignore
const __dirname = Path.dirname (Url.fileURLToPath (import.meta.url))

if (process.cwd () != __dirname)
{
    console.error (
        'You need to run this script in the `/api` directory.\n' +
        'This is necessary to resolve JSON references.'
    )
    process.exit (1)
}

/**
    @typedef {import ('openapi-types').OpenAPIV3.Document} OADocument

    @typedef {import ('openapi-types').OpenAPIV3.HeaderObject}   OAHeaderObject
    @typedef {import ('openapi-types').OpenAPIV3.SchemaObject}   OASchemaObject
    @typedef {import ('openapi-types').OpenAPIV3.LinkObject}     OALinkObject
    @typedef {import ('openapi-types').OpenAPIV3.EncodingObject} OAEncodingObject
    @typedef {import ('openapi-types').OpenAPIV3.ExampleObject}  OAExampleObject

    @typedef {object} Neutralino
    @property {OADocument & NeutralinoApp} app
    @property {OADocument & NeutralinoOs} os
    @property {OADocument & NeutralinoWindow} window

    @typedef {object} NeutralinoApp
    @property {import ('../api/app').components} components
    @property {import ('../api/app').paths} paths

    @typedef {object} NeutralinoOs
    @property {import ('../api/os').components} components
    @property {import ('../api/os').paths} paths

    @typedef {object} NeutralinoWindow
    @property {import ('../api/window').components} components
    @property {import ('../api/window').paths} paths
*/


export const namespaces = ['app', 'computer', 'debug', 'filesystem', 'os', 'storage', 'window']

function main ()
{
    if (process.argv.includes ('--schemas'))
        writeFlattenApis ()
}

export function exit (...texts)
{
    console.error (...texts)
    process.exit (1)
}

main ()


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
    Fs.writeFileSync (filepath, JSON.stringify (obj, null, 2))
}
