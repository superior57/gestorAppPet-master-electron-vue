import { postGetId, putResponse, del } from '../utils'

export const updateUser = async function (obj) {
  return await putResponse('gestor/user', obj)
}

export default {
  // namespaced: true,

  actions: {
    async deleteUser(context, id) {
      return await del(`gestor/user/${id}`)
    },

    async saveUser(context, obj) {
      if (obj.id === void 0) {
        return await postGetId('gestor/user', obj, context)
      } else {
        return await putResponse('gestor/user', obj)
      }
    }
  }
}