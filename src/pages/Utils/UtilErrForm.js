import axios, { HttpStatusCode } from 'axios'

export function isAxiousError(error) {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

// ------------------------------------check errors is ERROR.Unauthorized = 401 --------------------------------
export function isAxiosUnauthorizedError(error) {
  return isAxiousError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
