import { isPlainObject } from './util'
import { CONTENT_TYPE } from '../const'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(key => {
    if (key !== normalizedName && key.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[key]
      delete headers[key]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, CONTENT_TYPE)

  if (isPlainObject(data)) {
    if (headers && !headers[CONTENT_TYPE]) {
      headers[CONTENT_TYPE] = 'application/json;charset=utf-8'
    }
  }

  return headers
}
