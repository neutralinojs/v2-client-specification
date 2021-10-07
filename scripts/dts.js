
//@ts-check


import { execSync } from 'node:child_process'
import { ROOT_DIR, OUT_JSON, OUT_DTS, writeFile } from './lib.js'
import { writeFlattenApis } from './json.js'


/**
 * @param {string} outdir 
 */
export const writeDts = (outdir) => writeFlattenApis (outdir)
.then (() =>
{
    console.log ()
    console.log ('## Typescript definition files')
    
    // openapi-typescript cannot be imported as an ES module `import ots from 'openapi-typescript'`
    // So A sub-process is used.
    return execSync ('npx openapi-typescript ' + OUT_JSON, { encoding: 'utf8', cwd: ROOT_DIR })
})
.then (out => writeFile (OUT_DTS, `
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
