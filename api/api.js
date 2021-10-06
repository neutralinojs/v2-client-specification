
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


const namespaces = ['app', 'os', 'window']


function error (...texts)
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
function readYamlFile (filepath, flatten = true)
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
function writeJsonFile (obj, filepath)
{
    console.log ('Write', filepath)
    Fs.writeFileSync (filepath, JSON.stringify (obj, null, 2))
}


/**
    
 */
export async function writeFlattenApis ()
{
    /** @type {OADocument} */
    const api = await readYamlFile (Path.join (__dirname, 'api.yaml'), false)

    for (var ns of namespaces)
    {
        writeJsonFile (
            await readYamlFile (Path.join (__dirname, ns + '.yaml')),
            Path.join (__dirname, ns + '.json')
        )

        /** @type {OADocument} */
        var nsapi = await readYamlFile (Path.join (__dirname, ns + '.yaml'), false)

        var duplicates = []
        
        if (nsapi.paths &&
            getDuplicates (api.paths, nsapi.paths, duplicates)
        ) error (`Duplicate keys in ${ns}.yaml'#/paths`, duplicates)

        if (nsapi.components.requestBodies &&
            getDuplicates (api.components.requestBodies, nsapi.components.requestBodies, duplicates)
        ) error (`Duplicate keys in ${ns}.yaml'#/components/requestBodies`, duplicates)

        if (nsapi.components.responses &&
            getDuplicates (api.components.responses, nsapi.components.responses, duplicates)
        ) error (`Duplicate keys in ${ns}.yaml'#/components/responses`, duplicates)

        if (nsapi.components.schemas &&
            getDuplicates (api.components.schemas, nsapi.components.schemas, duplicates)
        ) error (`Duplicate keys in ${ns}.yaml'#/components/schemas`, duplicates)

        Object.assign (api.paths, nsapi.paths)
        Object.assign (api.components.requestBodies, nsapi.components.requestBodies)
        Object.assign (api.components.responses, nsapi.components.responses)
        Object.assign (api.components.schemas, nsapi.components.schemas)
    }

    writeJsonFile (api, Path.join (__dirname, 'api.json'))

    writeJsonFile (
        Object.assign (
            {
                '$schema': 'http://json-schema.org/draft-04/schema',
                id: 'https://neutralino.js.org/v2'
            },
            await readYamlFile (Path.join (__dirname, 'models', 'neutralino.config.schema.yaml'))
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
 
/**
    @returns {Promise <Neutralino>}
*/
export async function getNeutralinoApi ()
{
    const root = Path.join (__dirname, '..')
    
    const api = {}
    for (var name of namespaces)
        api[name] = await readYamlFile (Path.join (root, 'api', name + '.yaml'))

    //@ts-ignore
    return api
}


/**
    Obtain the response messages contained in the `/components/responses/*` fields of an OpenApi document

    Response messages written directly in the `/paths/**` fields are ignored.
    This is useful when we don't want to export certain types to `neutralino-api-types.d.ts`

    @param doc {OADocument}
    @returns {Response[]}

    @typedef {Object} Response
    @property {string}         name
    @property {string}         description
    @property {OASchemaObject} schema
    @property {Record <string, OAHeaderObject>}   [headers]
    @property {Record <string, OAEncodingObject>} [encoding]
    @property {Record <string, OALinkObject>}     [links]
    @property {Record <string, OAExampleObject>}  [examples]
 */
export function getResponses (doc)
{   
    const responses = doc["components"]
                    ? doc["components"]["responses"]
                    : null
    if (responses == null) return []

    /** @type {Response[]} */
    const schemas = []
    for (let name in responses)
    {
        var rep = responses[name]
        if ('$ref' in rep)
            throw invalidJsonRef ()

        var cnt = rep.content["application/json"]
        if ('$ref' in cnt.schema)
            throw invalidJsonRef ()

        if ("example" in cnt)
            throw new Error (
                'This script does no support tthe "example" field in the response object, ' +
                'use the "examples" fields instead\n' +
                `${doc.info.title} #/components/responses/${name}/content/application/json`)

        cnt.schema.title = name
        
        schemas.push ({
            name,
            description : rep.description,
            schema      : cnt.schema,
            headers     : rep.headers,
            links       : rep.links,
            encoding    : cnt.encoding,
            examples    : cnt.examples
        })
    }
    
    return schemas

    
    function invalidJsonRef ()
    {
        return new Error ('`getResponses` function does not support JSON references')
    }
}

