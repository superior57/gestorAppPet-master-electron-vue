import { format } from './format.js'
import { convert } from './convert.js'
import { printer } from './printer.js'

export const func = {
    format,
    convert,
    printer,
    selectFile(contentType, multiple) {
        return new Promise(resolve => {
            let input = document.createElement('input')
            input.type = 'file'
            input.multiple = multiple
            input.accept = contentType
            input.onchange = () => {
                let files = Array.from(input.files)
                if (multiple)
                    resolve(files)
                else {
                    resolve(files[0])
                }
            }
            input.click()
        });
    }
}