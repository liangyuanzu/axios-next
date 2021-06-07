import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'

function createInstance(defaultConfig: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(defaultConfig)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return <AxiosInstance>instance
}

const axios = createInstance(defaults)

export default axios
