import { AxiosRequestConfig } from './types'
import { CONTENT_TYPE, application } from './const'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/*, */*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',

  xsrfHeaderName: 'X-XSRF-TOKEN',

  transformRequest: [
    (data: any, headers: any): any => {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    (data: any): any => {
      return transformResponse(data)
    }
  ],

  validateStatus(status: number): boolean {
    return (status >= 200 && status < 300) || status === 304
  }
}

const methodNoData = ['get', 'delete', 'head', 'options']
methodNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodWithData = ['post', 'put', 'patch']
methodWithData.forEach(method => {
  defaults.headers[method] = {
    [CONTENT_TYPE]: application.x_www_form_urlencoded
  }
})

export default defaults
