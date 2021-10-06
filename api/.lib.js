
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

/**
    
 */
export function writeFlattenApis ()
{
    namespaces.forEach (name =>  write (
        Path.join (__dirname, name + '.yaml'),
        Path.join (__dirname, name + '.json')
    ))
    
    // TODO
    // $schema: 'http://json-schema.org/draft-04/schema'
    // id: 'https://neutralino.js.org/v2-client-specification'

    write (
        Path.join (__dirname, 'models', 'neutralino.config.schema.yaml'),
        Path.join (__dirname, '..', 'neutralino.config.schema.json')
    )

    
    function write (inputPath, outputPath)
    {
        var sch  = Yaml.parse (Fs.readFileSync (inputPath, { encoding: "utf8" }))
        Json.dereference (sch, (err, sch) => {
            console.log ('Write', outputPath)
            Fs.writeFileSync (outputPath, JSON.stringify (sch, null, 2))
        })
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
        api[name] = await read (Path.join (root, 'api', name + '.yaml'))

    //@ts-ignore
    return api


   function read (filepath)
   {
       return new Promise ((resolve, reject) => Json.dereference (
            Yaml.parse (Fs.readFileSync (filepath, 'utf8')),
            (err, sch) => { if (err) reject (err) ; resolve (sch) }
        ))
   }
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

