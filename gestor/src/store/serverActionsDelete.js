import { del } from './utils'

export const deleteCoupon = async function (context, id) {
  return await del(`coupon/${id}`)
}

export const deleteDelivery = async function (context, id) {
  return await del(`delivery/${id}`)
}

export const deleteProfessional = async function (context, id) {
  return await del(`professional/${id}`)
}

export const deleteCategory = async function (context, id) {
  return await del(`categorie/${id}`)
}