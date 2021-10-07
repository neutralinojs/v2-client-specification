
//@ts-check

import { execSync } from 'node:child_process'
import { __dirname, writeFile } from './api-tools.js'
import { writeFlattenApis } from './api-json.js'

const writeDts = () => writeFlattenApis ()
.then (() =>
{
    // openapi-typescript cannot be imported as an ES module `import ots from 'openapi-typescript'`
    // So A sub-process is used.
    return execSync ('npx openapi-typescript api.json', { encoding: 'utf8' })
})
.then (out => writeFile ('../neutralino.api.d.ts', `
// Types utilities

type Paths
    = keyof paths extends \`/__nativeMethod_\${infer P}\` ? P
    : never

type NativePath <P extends Paths> = \`/__nativeMethod_\${P}\`

type GetRequestMethods <P extends Paths>
    = keyof paths[NativePath <P>]

type GetOptions <P extends Paths, T extends GetRequestMethods <P>>
    = paths[NativePath <P>][T] extends {
        requestBody: {
            content: { ["application/json"]: any }
        }
    }
    ? paths[NativePath <P>][T]["requestBody"]["content"]["application/json"]
    : never

type GetResponse <P extends Paths, T extends GetRequestMethods <P>>
    = paths[NativePath <P>][T] extends {
        responses: {
            '200': { content: { ["application/json"]: any } }
        }
    }
    ? paths[NativePath <P>][T]["responses"]['200']["content"]["application/json"]
    : never

${out}
`))
.catch (err =>
{
    console.error (err) 
    process.exit (1)
})


if (process.argv.includes ('--build-dts'))
{
    writeDts ()
}
