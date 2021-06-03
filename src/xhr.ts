import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'
import { CONTENT_TYPE } from './const'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) request.responseType = responseType

    if (timeout) request.timeout = timeout

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = () => {
      if (request.readyState !== 4 || request.status === 0) return

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    function handleResponse(response: AxiosResponse): void {
      const { status } = response
      if ((status >= 200 && status < 300) || status === 304) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${status}`))
      }
    }

    request.onerror = () => {
      reject(new Error('Network Error'))
    }

    request.ontimeout = () => {
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    Object.keys(headers).forEach(key => {
      if (data === null && key.toUpperCase() === CONTENT_TYPE) {
        delete headers[key]
      } else {
        request.setRequestHeader(key, headers[key])
      }
    })

    request.send(data)
  })
}
