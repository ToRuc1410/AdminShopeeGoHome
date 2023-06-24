import { toast } from 'react-toastify'
import http from '../pages/Utils/http'
const authAPI = {
  async sendMail(body) {
    try {
      return await http.post('forgotpassword', body)
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: 'top-center',
        autoClose: 3000
      })
    }
  },
  async loginAdmin(body) {
    try {
      return await http.post('login', body)
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: 'top-center',
        autoClose: 3000
      })
    }
  },
  async logoutAdmin() {
    try {
      return await http.post('logout')
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: 'top-center',
        autoClose: 3000
      })
    }
  }
}

export default authAPI
