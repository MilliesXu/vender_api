import axios from 'axios'

const base = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`
const authBase = `${base}/auth`

axios.defaults.withCredentials = true

const axiosInstance = axios.create({
  baseURL: base
})

axiosInstance.interceptors.request.use(async req => {
  await axios.get(`${authBase}/refresh`)
  return req
})

export default axiosInstance
