#!node

import Fs from 'fs'
import { join as joinPath, dirname } from 'path'
import { fileURLToPath } from 'url'
import Yaml from 'yaml'
import { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } from 'quicktype-core'

// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag
const root = joinPath (dirname (fileURLToPath (import.meta.url)), '..')
const namespaces = ['app', 'window']

//@ts-check

/**
 * @param apiNamespace {string} - `app`, `os`, `window`, ...
 */
function getResponses (apiNamespace)
{
    const path = joinPath (root, 'api', apiNamespace + '.yaml')
    const yaml = Yaml.parse (Fs.readFileSync (path, 'utf8'))

    /** @type {Record <string, import ('./openapi').OpenAPIV3.ResponseObject>} */
    const responses = yaml["components"]
                    ? yaml["components"]["responses"]
                    : null
    if (responses == null) return []

    const schemas = []
    for (let name in responses)
    {
        var rep = responses[name]
        var cnt = rep.content["application/json"]

        if ('$ref' in cnt.schema)
            throw new Error ('This script does not support JSON references')

        if (cnt.example)
            throw new Error (
                'This script does not support the "example" field in the response object, ' +
                'use the "examples" fields instead\n' +
                `${apiNamespace}.yaml#/components/responses/${name}/content/application/json`)

        cnt.schema.title = name
        
        schemas.push ({
            name,
            description : rep.description,
            headers     : rep.headers,
            links       : rep.links,
            ...cnt
        })
    }
    
    return schemas
}


Promise.all (namespaces.map (async ns =>
{
    const schemaInput = new JSONSchemaInput (new FetchingJSONSchemaStore ())

    // Shared definitions (like Always Success Response) are replaced
    await Promise.all (
        getResponses (ns).map (rep => schemaInput.addSource (
            { name: rep.name, schema: JSON.stringify (rep.schema) }
        ))
    )

    const inputData = new InputData ()
    inputData.addInput(schemaInput)

    console.log (`Generate Neutralino.${ns}`)
    const result = await quicktype ({
        inputData,
        lang: "ts",
        rendererOptions: {
            // https://github.com/quicktype/quicktype-vscode/blob/master/src/extension.ts#L100
            "just-types": "true"
        }
    })

    return '\n'
         + `declare module 'Neutralino.${ns}' {\n\n`
         +  result.lines.join ('\n')
         + '\n}'
}))
.then (dts => 
{
    const filename = 'neutralino-api-types.d.ts'

    console.log (`Write ${filename}`)
    Fs.writeFileSync (joinPath (root, filename), dts.join ('\n'), "utf8")
})

