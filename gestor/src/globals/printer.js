export const printer = {
    print(idElement) {
        var iframe = document.createElement('iframe')
        iframe.width = '1px'
        iframe.height = '1px'
        iframe.src = 'about:blank'

        // for IE wait for the IFrame to load so we can access contentWindow.document.body
        iframe.onload = function () {
            var tagScript = iframe.contentWindow.document.createElement("script")

            tagScript.type = "text/javascript"

            var script = iframe.contentWindow.document.createTextNode(`
                function Print(){
                    window.focus(); 
                    window.print();
                }
            `)

            tagScript.appendChild(script)

            iframe.contentWindow.document.body.innerHTML = document.getElementById(idElement).innerHTML
            iframe.contentWindow.document.body.appendChild(tagScript)

            // for chrome, a timeout for loading large amounts of content
            setTimeout(function () {
                iframe.contentWindow.Print()
                iframe.contentWindow.document.body.removeChild(tagScript)
                iframe.parentElement.removeChild(iframe)
            }, 200)
        };
        document.body.appendChild(iframe)
    },
}