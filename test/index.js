

window.localStorage.TryIt_securitySchemeValues = JSON.stringify ({ "basicAuth":'Basic ' + NL_TOKEN })


document.addEventListener ('DOMContentLoaded', () =>
{
    const observer = new MutationObserver (mutations =>
    {
        observer.disconnect ()

        for (var m of mutations)
        {
            if (m.addedNodes == null) continue
            for (var node of m.addedNodes)
            {
                if (node instanceof HTMLElement &&
                    node.classList.contains ('prism-code') &&
                    node.classList.contains ('language-js')
                ) {
                    var btn = document.createElement ('button')
                    btn.style.all = 'revert' 
                    btn.textContent = 'Test'

                    var pre = document.createElement ('pre')
                    pre.style.color = 'grey'

                    btn.onclick = evalCodeHandle (node.innerText, pre)

                    node.append (btn, pre)
                }
            }
        }

        observer.observe (document.body, { childList: true, subtree: true })
    })
    observer.observe (document.body, { childList: true, subtree: true })

    const evalCodeHandle = (code, target) => async () =>
    {
        var result

        try {
            result = await eval (code)
        } catch (error) {
            target.textContent = error instanceof Error
                ? ''+error
                : JSON.stringify (error, null, 2)
            return
        }

        if (!result) {
            target.textContent = result
            return
        }
        target.textContent = typeof result === 'object'
            ? JSON.stringify (result, null, 2)
            : result
    }
})