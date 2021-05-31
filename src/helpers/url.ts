import { isDate, isObject } from './util'

function encode(val: any): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params: any): string {
  if (!params) return url

  const parts: string[] = []

  for (let [key, val] of Object.entries(params)) {
    if (val == null) continue
    if (isDate(val)) {
      val = val.toISOString()
    } else if (isObject(val)) {
      val = JSON.stringify(val)
    }
    parts.push(`${encode(key)}=${encode(val)}`)
  }

  const serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = serializedParams.indexOf('#')
    if (markIndex !== -1) url = url.slice(0, markIndex)
    const str = url.indexOf('?') === -1 ? '?' : '&'
    url += str + serializedParams
  }

  return url
}
