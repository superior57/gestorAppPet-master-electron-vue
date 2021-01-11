import { getResponse, getParams } from '../utils'

export default {
    actions: {
        async listDistricts(context, filters) {
            return await getResponse(`districts?${getParams(filters)}`)
        }
    }
}