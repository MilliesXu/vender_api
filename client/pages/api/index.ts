import axios from 'axios'

const base = process.env.NEXT_PUBLIC_API_ENDPOINT
const userBase = `${base}/api/user`
const authBase = `${base}/api/auth`

export const registerUser = async (payload: {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  passwordConfirmation: string
}) => {
  const res = await axios.post(userBase, payload)
  return res.data
}

export const loginUser = async (payload: {
  email: string,
  password: string
}) => {
  const res = await axios.post(`${authBase}/login/`, payload)
  return res.data
}
