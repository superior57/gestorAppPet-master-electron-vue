import { putResponse, getResponse } from "../utils"

export const getCompany = async function (id) {
  return await getResponse(`company/${id}`)
}

export const updateCompany = async function (obj) {
  return await putResponse('company/', obj)
}

export default {
  actions: {
    async getCompany(context, id) {
      return await getCompany(id)
    },

    async getBranchs(context, id) {
      return await getResponse(`remove/${id}`)
    }
  }
}