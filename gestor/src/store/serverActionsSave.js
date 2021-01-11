import { postGetId, putResponse } from './utils';

export const saveCategory = async function (context, obj) {
  if (obj.id === void 0) {
    return await postGetId('categorie', obj, context)
  } else {
    return await putResponse(`categorie/${obj.id}`, obj)
  }
}

export const saveCoupon = async function (context, obj) {
  if (obj.id === void 0) {
    return await postGetId('coupon', obj, context)
  } else {
    return await putResponse('coupon', obj)
  }
}

export const saveDelivery = async function (context, obj) {
  if (obj.id === void 0) {
    return await postGetId('delivery/add', obj, context)
  } else {
    return await putResponse('delivery', obj)
  }
}

export const saveProfessional = async function (context, obj) {
  if (obj.id == 0) {
    return await postGetId('professional', obj, context)
  } else {
    return await putResponse('professional', obj)
  }
}

export const saveService = async function (context, obj) {
  if (obj.id === void 0) {
    return await postGetId('service', obj, context)
  } else {
    return await putResponse('service', obj)
  }
}