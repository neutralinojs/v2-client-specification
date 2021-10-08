
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

export const ROOT_DIR  = Path.join (__dirname, '..')
export const API_NAMES = ['app', 'computer', 'debug', 'filesystem', 'os', 'storage', 'window']

export const API_DIR   = Path.join (ROOT_DIR, 'api')
export const DOC_DIR   = Path.join (ROOT_DIR, 'docs')
export const OUT_DIR   = Path.join (ROOT_DIR, 'dist')
export const OUT_DTS   = Path.join (ROOT_DIR, 'dist', 'neutralino.api.d.ts')
export const OUT_JSON  = Path.join (ROOT_DIR, 'dist', 'neutralino.api.json')


if (Fs.existsSync (OUT_DIR) === false)
    Fs.mkdirSync (OUT_DIR, { recursive: true })


/**
 * @param {`--${string}`} name 
 */
export function getCmdArgument (name)
{
    var i = process.argv.indexOf (name) + 1
    return i === 0 || i >= process.argv.length ? undefined : process.argv[i]
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
    if (flatten)
    {
        const cwd = process.cwd ()
        
        process.chdir (Path.dirname (filepath))
        return new Promise ((resolve, reject) =>
        {
            return Json.dereference (
                Yaml.parse (Fs.readFileSync (filepath, 'utf8')),
                { dereference: { circular: false } },
                (err, sch) => { if (err) reject (err) ; resolve (sch) }
            )
        })
        .finally (() => process.chdir (cwd))
        
    }
    else
    {
        return Promise.resolve (Yaml.parse (Fs.readFileSync (filepath, 'utf8')))
    }
    
}

/**
 * 
 * @param {string} namespace 
 * @returns {Promise <OADocument>}
 */
export function readApiNs (namespace)
{
    return readYamlFile (Path.join (API_DIR, namespace + '.yaml'))
}

/**
 * @param {string} filepath 
 * @param {object} obj 
 */
export function writeJsonFile (filepath, obj)
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
