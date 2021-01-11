import { post } from '../utils'

export default {
    actions: {
        async report(context, content) {
            return await post('report/', content)
        },

        async customPrint(context, content) {
            return await post('custom-print/', content)
        }
    }
}