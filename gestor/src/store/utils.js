import Vue from 'vue'

export const get = function (path) {
  return new Promise((resolve, reject) => {
    try {
      Vue.http.get(path)
        .then(response => resolve(response))
        .catch(error => reject(error))
    } catch (error) {
      reject(error)
    }
  })
}

export const post = function (path, obj) {
  return new Promise((resolve, reject) => {
    try {
      Vue.http.post(path, obj)
        .then(response => resolve(response))
        .catch(error => reject(error))
    } catch (error) {
      reject(error)
    }
  })
}

export const put = function (path, obj) {
  return new Promise((resolve, reject) => {
    try {
      Vue.http.put(path, obj)
        .then(response => resolve(response))
        .catch(error => reject(error))
    } catch (error) {
      reject(error)
    }
  })
}

export const getParams = function (filter) {
  let keys = Object.keys(filter); '';
  let params = ''

  keys.forEach(key => {
    if (params)
      params += `&${key}=${filter[key]}`
    else
      params += `${key}=${filter[key]}`
  });

  return params
}

export const getResponse = async function (path) {
  return (await get(path)).json()
}

export const postResponse = async function (path, obj) {
  return (await post(path, obj)).json()
}

export const putResponse = async function (path, obj) {
  return (await put(path, obj)).json()
}

export const postGetId = async function (path, obj, context) {
  obj.company_id = context.getters.company.id
  const response = await postResponse(path, obj);

  if (response.error) throw response.error

  obj.id = response.data.id
  return response
}

export const del = function (path) {
  return new Promise((resolve, reject) => {
    try {
      Vue.http.delete(path)
        .then(response => resolve(response))
        .catch(error => reject(error))
    } catch (error) {
      reject(error)
    }
  })
}