import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { CONTENT_TYPE, AUTHORIZATION } from '../const'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest(): void {
      if (responseType) request.responseType = responseType
      if (timeout) request.timeout = timeout
      if (withCredentials) request.withCredentials = withCredentials
    }

    function addEvents(): void {
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

      request.onerror = (): void => {
        reject(createError('Network Error', config, null, request))
      }
      request.ontimeout = (): void => {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) request.onprogress = onDownloadProgress
      if (onUploadProgress) request.upload.onprogress = onUploadProgress
    }

    function processHeaders(): void {
      if (isFormData(data)) delete headers[CONTENT_TYPE]

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.get(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        const { username, password } = auth
        headers[AUTHORIZATION] = 'Basic ' + btoa(username + ':' + password)
      }

      Object.keys(headers).forEach(key => {
        if (data === null && key.toUpperCase() === CONTENT_TYPE) {
          delete headers[key]
        } else {
          request.setRequestHeader(key, headers[key])
        }
      })
    }

    async function processCancel() {
      if (cancelToken) {
        try {
          const reason = await cancelToken.promise
          request.abort()
          reject(reason)
        } catch (e) {
          console.log(e)
        }
      }
    }

    function handleResponse(response: AxiosResponse): void {
      const { status } = response
      if ((status >= 200 && status < 300) || status === 304) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${status}`, config, null, request, response)
        )
      }
    }
  })
}
