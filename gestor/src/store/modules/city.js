import { getResponse, getParams } from '../utils'

export default {
    actions: {
        async listCities(context, filters) {
            return await getResponse(`cities?${getParams(filters)}`)
        }
    }
}