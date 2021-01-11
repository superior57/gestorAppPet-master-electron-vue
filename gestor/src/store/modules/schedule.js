import { getResponse, putResponse, getParams } from '../utils'

export const getSchedules = async function (company_id) {
  return await getResponse(`schedules/${company_id}`)
}

export default {
  actions: {
    async putSchedule(context, obj) {
      if (obj.status == 'CA')
        obj.cancel_origin = 'L'

      return await putResponse('schedule/', obj)
    },

    async listSchedules(context, filters) {
      return await getResponse(`listschedules?${getParams(filters)}`)
    }
  }
}