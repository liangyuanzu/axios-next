import { AxiosRequestConfig } from './types'
import { CONTENT_TYPE } from './const'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', data = null, headers } = config

  const request = new XMLHttpRequest()

  request.open(method.toLocaleLowerCase(), url, true)

  Object.keys(headers).forEach(key => {
    if (data === null && key.toUpperCase() === CONTENT_TYPE) {
      delete headers[key]
    } else {
      request.setRequestHeader(key, headers[key])
    }
  })

  request.send(data)
}
