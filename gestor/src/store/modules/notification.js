import { postResponse } from "../utils"

export default {
    actions: {
        async notification(context, notification) {
            return await postResponse('notification/', notification)
        }
    }
}