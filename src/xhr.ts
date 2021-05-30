import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', data = null } = config

  const request = new XMLHttpRequest()
  request.open(method.toLocaleLowerCase(), url, true)
  request.send(data)
}
