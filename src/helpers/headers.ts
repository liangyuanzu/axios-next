import { isPlainObject } from './util'
import { CONTENT_TYPE, application } from '../const'
import { Method } from '../types'
import { deepMerge } from './util'

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
      headers[CONTENT_TYPE] = application.json
    }
  }

  return headers
}

export function parseHeaders(headers: string): object {
  const parsed = Object.create(null)
  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (val) val = val.trim()
    parsed[key] = val
  })
  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return headers

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['get', 'post', 'put', 'patch', 'head', 'options', 'delete', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
