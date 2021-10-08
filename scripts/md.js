
// @ts-check


import Fs from 'fs'
import Path from 'path'
import { API_NAMES, DOC_DIR, readApiNs } from './lib.js'


/**
    @param {string} ns
    @param {import ('./lib').OADocument} doc
*/
const formatDoc = (ns, doc) =>
({
path: Path.join (DOC_DIR, ns + '.md'),
content: `---
title: ${doc.info.title}
---

${doc.info.description}

${Object.values (doc.paths).map (p => p.get || p.post).map ((op) => `
## ${op.summary}

${op.description}
`).join ('')}`
})


API_NAMES.forEach (ns => formatNs (ns))
async function formatNs (ns)
{
    readApiNs (ns)
    .then ((doc) => formatDoc (ns, doc))
    .then (result =>
    {
        console.log ('Write ' + result.path)
        Fs.writeFileSync (result.path, result.content)
    })
}
