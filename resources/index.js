/// <reference path="./js/neutralino.d.ts" />

// @ts-check

Neutralino.init ()
Neutralino.events.on ("windowClose", () => {
    Neutralino.app.exit()
})

/** @type {HTMLSelectElement} */
const nsselect = document.createElement ('select')

/** @type {HTMLElement} */
var apiview

document.addEventListener ('DOMContentLoaded', () =>
{
    const namespace = ['app', 'os', 'window']
    nsselect.style.all = 'revert'
    for (var ns of namespace)
    {
        var opt = document.createElement ('option')
        opt.value = ns
        opt.text = ns
        nsselect.options.add (opt)
    }

    document.body.firstElementChild.append (
        nsselect, document.createElement ('br'),
        document.createElement ('br'),
        document.createElement ('hr')
    )
    
    showNamespace (namespace[nsselect.options.selectedIndex = 1])
    nsselect.addEventListener ('change', () => showNamespace (nsselect.options.item (nsselect.options.selectedIndex).value))
})

/**
 * 
 * @param {string} ns 
 */
function showNamespace (ns)
{
    if (apiview)
        apiview.remove ()
    
    apiview = document.createElement ('elements-api')
    apiview.setAttribute ('apiDescriptionUrl', '../api/' + ns + '.yaml')
    apiview.setAttribute ('router', 'hash')
    apiview.setAttribute ('layout', 'stacked')
    document.body.append (apiview)
}