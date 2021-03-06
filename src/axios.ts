import { AxiosStatic, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import mergeConfig from './core/mergeConfig'
import { extend } from './helpers/util'
import defaults from './defaults'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(defaultConfig: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(defaultConfig)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = config => {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = promises => Promise.all(promises)
axios.spread = callback => arr => callback.apply(null, arr)
axios.Axios = Axios

export default axios
