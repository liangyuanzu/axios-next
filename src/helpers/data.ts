import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) data = JSON.stringify(data)
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // TODO
    }
  }
  return data
}
