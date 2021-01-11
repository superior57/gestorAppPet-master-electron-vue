import { getResponse, putResponse, getParams } from '../utils'

export const getOrders = async function (company_id) {
  return await getResponse(`neworders/${company_id}`)
}

export const getOrderItems = async function (order_id) {
  return await getResponse(`order/items/${order_id}`)
}

export default {
  actions: {
    async putOrder(context, obj) {
      if (obj.status == 'CA')
        obj.cancel_origin = 'L'

      return await putResponse('order/', obj)
    },

    async listOrders(context, filters) {
      return await getResponse(`sales?${getParams(filters)}`)
    }
  }
}