import { getResponse, getParams } from '../utils'

export default {
    actions: {
        async listClients(context, filters) {
            return await getResponse(`listclients?${getParams(filters)}`)
        }
    }
}