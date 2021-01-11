import { getResponse } from './utils'

export const getBranchAddress = async function (context, company_id) {
  return await getResponse(`gestor/branch/${company_id}`)
}

export const getCategories = async function (context, company_id) {
  return await getResponse(`categories/${company_id}`)
}

export const getClients = async function (context, company_id) {
  return await getResponse(`clients/${company_id}`)
}

export const getCoupons = async function (context, company_id) {
  return await getResponse(`coupons/${company_id}`)
}

export const getDeliveries = async function (context, company_id) {
  return await getResponse(`delivery/${company_id}`)
}

export const getProfessionals = async function (context, company_id) {
  return await getResponse(`gestorprofessionals/${company_id}`)
}

export const getServices = async function (context, company_id) {
  return await getResponse(`services/${company_id}`)
}

export const getUsers = async function (context, company_id) {
  return await getResponse(`gestor/users/${company_id}`)
}

export const getVariations = async function (context, { company_id, product_id }) {
  return await getResponse(`variations/${company_id}/${product_id}`)
}