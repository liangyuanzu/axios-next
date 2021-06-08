import { AxiosStatic, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import mergeConfig from './core/mergeConfig'
import { extend } from './helpers/util'
import defaults from './defaults'

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

export default axios
