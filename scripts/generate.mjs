#!node

/*/
    Neutralino's global source structure associates one file with an API namespace.

    For the `Neutralino.app` namespace, there is
    - `app.cpp` in the server repository
    - `app.ts` in the client repository
    - `app.md` in documentation

    Likewise, there is one API definition file per namespace in the 'api' directory.
    - `app.yaml`

    Each API definition must be a root OpenApi file.
/*/

// @ts-check

import Fs from 'fs'
import { join as joinPath, dirname } from 'path'
import { fileURLToPath } from 'url'
// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag
//@ts-ignore
const __dirname = dirname (fileURLToPath (import.meta.url))

import {  getResponses, getNeutralinoApi, writeFlattenApis } from '../api/api.js'
/** @typedef {import ('../api/api').OADocument} OADocument */

async function main ()
{
    const root = joinPath (__dirname, '..')
    const Api = await getNeutralinoApi ()

    if (process.argv.includes ('--all'))
    {
        process.argv.push ('--dts')
        process.argv.push ('--schema')
        process.argv.push ('--test')
    }

    // Generate the typescript definitions file.
    if (process.argv.includes ('--dts'))
    {
        Promise.all (Object.entries (Api).map
        (
            ([ns, doc]) => formatTsInterfaces (ns, doc)
        ))
        .then (dts => 
        {
            const filename = 'neutralino-api-types.ts'

            console.log (`Write ${filename}`)
            Fs.writeFileSync (joinPath (root, filename), dts.join ('\n'), "utf8")
        })
    }

    // Only convert YAML schema file to JSON.
    if (process.argv.includes ('--schema'))
        writeFlattenApis ()

    if (process.argv.includes ('--test'))
    {

    }
}


/**
 * @param ns {string}
 * @param doc {OADocument}
 */
const formatTsInterfaces = async (ns, doc) =>
{
    const { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } = await import ('quicktype-core')
    
    const responses = await getResponses (doc)

    // Shared definitions are replaced
    const schemaInput = new JSONSchemaInput (new FetchingJSONSchemaStore ())
    await Promise.all (
        responses.map (rep => schemaInput.addSource (
            { name: rep.name, schema: JSON.stringify (rep.schema) }
        ))
    )

    const inputData = new InputData ()
    inputData.addInput(schemaInput)

    console.log (`Generate ${ns}`)
    const result = await quicktype ({
        inputData,
        lang: "ts",
        rendererOptions: {
            // https://github.com/quicktype/quicktype-vscode/blob/master/src/extension.ts#L100
            "just-types": "true"
        }
    })

    return '\n'
         + '/**\n'
         +  doc.info.description
         + '\n*/\n'
         + `export module ${ns} {\n\n`
         +  result.lines.join ('\n')
         + '\n}'
}

function logError (err) 
{
    if (err)
        console.log ('\n###\n' + err + '\n###\n')
}

main ().catch (logError)
