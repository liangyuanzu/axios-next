import { AxiosRequestConfig } from './types'
import { CONTENT_TYPE, application } from './const'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/*, */*'
    }
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
