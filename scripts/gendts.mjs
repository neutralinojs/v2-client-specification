#!node

//@ts-check

import Fs from 'fs'
import Yaml from 'yaml'
import { quicktype, InputData, JSONSchemaInput } from 'quicktype-core'

const namespaces = [
    'app',
    'window'
]

/**
 * @param apiNamespace {string} - `app`, `os`, `window`, ...
 */
function getResponses (apiNamespace)
{
    const path = 'neu-' + apiNamespace + '.yaml'
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
                `${path}#/components/responses/${name}/content/application/json`)

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
    const inputData = new InputData ()

    // Shared definitions (like Always Success Response) are replaced
    await Promise.all (
        getResponses (ns).map (rep => inputData.addSource (
            "schema",
            { name: rep.name, schema: JSON.stringify (rep.schema) },
            () => new JSONSchemaInput (undefined)
        ))
    )

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
    const outpath = 'dist/neutralino-api-types.d.ts'

    if (Fs.existsSync ('dist') === false)
        Fs.mkdirSync ('dist', { recursive: true })

    console.log (`Write ${outpath}`)
    Fs.writeFileSync (outpath, dts.join ('\n'), "utf8")
})

